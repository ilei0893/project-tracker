# frozen_string_literal: true

require "rails_helper"

RSpec.describe JWTAuthenticatable, type: :controller do
  controller(ApplicationController) do
    def index
      render json: { message: "success" }, status: :ok
    end
  end

  before { routes.draw { get "index" => "anonymous#index" } }

  fixtures :users

  let(:user) { users(:one) }
  let(:token) { controller.encode(user) }

  describe "#encode" do
    it "returns a string" do
      expect(token).to be_a(String)
    end

    it "encodes the user id and email in the payload" do
      decoded = JWT.decode(token, Rails.application.credentials.jwt_secret, true, { algorithm: "HS256" })
      data = decoded.first["data"]

      expect(data["id"]).to eq(user.id)
      expect(data["email"]).to eq(user.email)
    end

    it "sets the token type and algorithm headers" do
      decoded = JWT.decode(token, Rails.application.credentials.jwt_secret, true, { algorithm: "HS256" })
      headers = decoded.last

      expect(headers["typ"]).to eq("JWT")
      expect(headers["alg"]).to eq("HS256")
    end

    it "sets an expiration claim" do
      decoded = JWT.decode(token, Rails.application.credentials.jwt_secret, true, { algorithm: "HS256" })

      expect(decoded.first["exp"]).to be_present
    end

    it "sets a unique jti claim" do
      first_token = JWT.decode(
        controller.encode(user),
        Rails.application.credentials.jwt_secret,
        true,
        { algorithm: "HS256" }
      )
      second_token = JWT.decode(
        controller.encode(user),
        Rails.application.credentials.jwt_secret,
        true,
        { algorithm: "HS256" }
      )

      expect(first_token.first["jti"]).not_to eq(second_token.first["jti"])
    end
  end

  describe "#authenticate" do
    context "with a valid token" do
      it "allows the request through" do
        get :index, headers: { 'Authorization' => "Bearer #{token}" }

        expect(response).to have_http_status(:ok)
      end
    end

    context "without a token" do
      before { allow(controller).to receive(:current_user).and_return(nil) }

      it "returns unauthorized" do
        get :index

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Unauthorized")
      end
    end

    context "with an expired token" do
      before do
        expired_token = JWT.encode(
          {
            data: {
              id: user.id,
              email: user.email
            },
            exp: 1.hour.ago.to_i
          },
          Rails.application.credentials.jwt_secret,
          "HS256"
        )
        request.headers["Authorization"] = "Bearer #{expired_token}"
      end

      it "returns unauthorized with an expiry message" do
        get :index

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Token has expired")
      end
    end
  end
end
