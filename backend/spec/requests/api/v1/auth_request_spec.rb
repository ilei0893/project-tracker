# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::AuthController, type: :request do
  describe "POST /api/v1/register" do
    context "with valid params" do
      let(:valid_params) do
        { email: "user@example.com", password: "password", password_confirmation: "password" }
      end

      it "creates a user and returns 201" do
        expect {
          post "/api/v1/register", headers: auth_headers(token), params: valid_params
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "normalizes the email to lowercase" do
        post "/api/v1/register", headers: auth_headers(token), params: valid_params.merge(email: "USER@EXAMPLE.COM")

        expect(User.last.email).to eq("user@example.com")
      end
    end

    context "with invalid params" do
      it "returns 422 when email is missing" do
        post "/api/v1/register",
          headers: auth_headers(token),
          params: { password: "password", password_confirmation: "password" }

        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)).to include("Email can't be blank")
      end

      it "returns 422 when password confirmation does not match" do
        post "/api/v1/register",
          headers: auth_headers(token),
          params: { email: "user@example.com", password: "password", password_confirmation: "wrong" }

        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)).to include("Password confirmation doesn't match Password")
      end

      it "returns 422 when email is already taken" do
        User.create!(email: "user@example.com", password: "password", password_confirmation: "password")

        post "/api/v1/register",
          headers: auth_headers(token),
          params: { email: "user@example.com", password: "password", password_confirmation: "password" }

        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)).to include("Email has already been taken")
      end

      it "does not create a user when params are invalid" do
        expect {
          post "/api/v1/register",
            headers: auth_headers(token),
            params: { email: "", password: "password", password_confirmation: "password" }
        }.not_to change(User, :count)
      end
    end
  end

  describe "POST /api/v1/login" do
    let(:user) { User.create!(email: "user@example.com", password: "password", password_confirmation: "password") }

    context "with valid credentials" do
      it "returns 200 with a token" do
        user
        post "/api/v1/login", params: { email: user.email, password: "password" }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to have_key("token")
      end
    end

    context "with an invalid password" do
      it "returns 401" do
        user
        post "/api/v1/login", params: { email: user.email, password: "wrong" }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid email or password")
      end
    end

    context "with a non-existent email" do
      it "returns 401" do
        post "/api/v1/login", params: { email: "nobody@example.com", password: "password" }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid email or password")
      end
    end
  end
end
