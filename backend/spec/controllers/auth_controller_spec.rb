# frozen_string_literal: true

require "rails_helper"

RSpec.describe AuthController, type: :request do
  describe "POST /register" do
    context "with valid params" do
      let(:valid_params) do
        { email: "user@example.com", password: "password", password_confirmation: "password" }
      end

      it "creates a user and returns 201" do
        expect {
          post "/register", params: valid_params
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "normalizes the email to lowercase" do
        post "/register", params: valid_params.merge(email: "USER@EXAMPLE.COM")

        expect(User.last.email).to eq("user@example.com")
      end
    end

    context "with invalid params" do
      it "returns 422 when email is missing" do
        post "/register", params: { password: "password", password_confirmation: "password" }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include("Email can't be blank")
      end

      it "returns 422 when password confirmation does not match" do
        post "/register", params: { email: "user@example.com", password: "password", password_confirmation: "wrong" }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include("Password confirmation doesn't match Password")
      end

      it "returns 422 when email is already taken" do
        User.create!(email: "user@example.com", password: "password", password_confirmation: "password")

        post "/register", params: { email: "user@example.com", password: "password", password_confirmation: "password" }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include("Email has already been taken")
      end

      it "does not create a user when params are invalid" do
        expect {
          post "/register", params: { email: "", password: "password", password_confirmation: "password" }
        }.not_to change(User, :count)
      end
    end
  end

  describe "POST /login" do
    it "returns 200" do
      post "/login"

      expect(response).to have_http_status(:ok)
    end
  end
end
