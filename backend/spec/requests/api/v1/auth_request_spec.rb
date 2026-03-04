# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::AuthController, type: :request do
  let(:user_params) do
    {
      email: "user@example.com",
      first_name: "Ariana",
      last_name: "Grande",
      password: "password",
      password_confirmation: "password"
    }
  end

  let(:user) { User.create!(user_params) }

  describe "POST /api/v1/register" do
    context "with valid params" do
      let(:valid_params) { { auth: user_params } }

      it "creates a user and returns 201" do
        expect {
          post "/api/v1/register", params: valid_params
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "normalizes the email to lowercase" do
        post "/api/v1/register", params: { auth: user_params.merge(email: "USER@EXAMPLE.COM") }

        expect(User.last.email).to eq("user@example.com")
      end
    end

    context "with invalid params" do
      it "returns 422 when email is missing" do
        post "/api/v1/register", params: { auth: user_params.merge(email: "") }

        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)).to include("Email can't be blank")
      end

      it "returns 422 when password confirmation does not match" do
        post "/api/v1/register", params: { auth: user_params.merge(password_confirmation: "wrong") }

        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)).to include("Password confirmation doesn't match Password")
      end

      it "returns 422 when email is already taken" do
        user
        post "/api/v1/register", params: { auth: user_params }

        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)).to include("Email has already been taken")
      end

      it "does not create a user when params are invalid" do
        expect {
          post "/api/v1/register", params: { auth: user_params.merge(email: "") }
        }.not_to change(User, :count)
      end
    end
  end

  describe "POST /api/v1/login" do
    context "with valid credentials" do
      it "returns 200 with a refresh token and user data" do
        user
        post "/api/v1/login", params: { auth: { email: user.email, password: "password" } }

        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body).to have_key("refresh_token")
        expect(body["user"]).to include("email" => user.email, "first_name" => "Ariana", "last_name" => "Grande")
      end

      it "sets an access_token cookie" do
        user
        post "/api/v1/login", params: { auth: { email: user.email, password: "password" } }

        expect(cookies[:access_token]).to be_present
      end

      it "creates a refresh token for the user" do
        user
        expect {
          post "/api/v1/login", params: { auth: { email: user.email, password: "password" } }
        }.to change { user.refresh_tokens.count }.by(1)
      end
    end

    context "with an invalid password" do
      it "returns 401" do
        user
        post "/api/v1/login", params: { auth: { email: user.email, password: "wrong" } }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid email or password")
      end
    end

    context "with a non-existent email" do
      it "returns 401" do
        post "/api/v1/login", params: { auth: { email: "nobody@example.com", password: "password" } }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid email or password")
      end
    end
  end

  describe "POST /api/v1/refresh" do
    context "with a valid refresh token" do
      let(:raw_token) { RefreshToken.generate_for(user) }

      it "returns 200 with a new refresh token and user data" do
        post "/api/v1/refresh", params: { refresh_token: raw_token }

        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body).to have_key("refresh_token")
        expect(body["refresh_token"]).not_to eq(raw_token)
        expect(body["user"]).to include("email" => user.email)
      end

      it "sets a new access_token cookie" do
        post "/api/v1/refresh", params: { refresh_token: raw_token }

        expect(cookies[:access_token]).to be_present
      end

      it "revokes the old refresh token" do
        post "/api/v1/refresh", params: { refresh_token: raw_token }

        digest = Digest::SHA256.hexdigest(raw_token)
        old_token = RefreshToken.find_by(token_digest: digest)
        expect(old_token.revoked_at).to be_present
      end

      it "creates a new refresh token for the user" do
        raw_token # force creation
        expect {
          post "/api/v1/refresh", params: { refresh_token: raw_token }
        }.to change { user.refresh_tokens.count }.by(1)
      end
    end

    context "with a revoked refresh token" do
      it "returns 401" do
        raw_token = RefreshToken.generate_for(user)
        digest = Digest::SHA256.hexdigest(raw_token)
        RefreshToken.find_by(token_digest: digest).revoke!

        post "/api/v1/refresh", params: { refresh_token: raw_token }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid or expired refresh token")
      end
    end

    context "with an expired refresh token" do
      it "returns 401" do
        raw_token = RefreshToken.generate_for(user)
        digest = Digest::SHA256.hexdigest(raw_token)
        RefreshToken.find_by(token_digest: digest).update!(expires_at: 1.day.ago)

        post "/api/v1/refresh", params: { refresh_token: raw_token }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid or expired refresh token")
      end
    end

    context "with an invalid token" do
      it "returns 401" do
        post "/api/v1/refresh", params: { refresh_token: "bogus" }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid or expired refresh token")
      end
    end

    context "with no token" do
      it "returns 401" do
        post "/api/v1/refresh", params: {}

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include("error" => "Invalid or expired refresh token")
      end
    end
  end

  describe "POST /api/v1/logout" do
    before { cookies[:access_token] = token }

    context "with a valid refresh token" do
      let(:raw_token) { RefreshToken.generate_for(user) }

      it "returns 200" do
        post "/api/v1/logout", params: { refresh_token: raw_token }

        expect(response).to have_http_status(:ok)
      end

      it "revokes the refresh token" do
        post "/api/v1/logout", params: { refresh_token: raw_token }

        digest = Digest::SHA256.hexdigest(raw_token)
        expect(RefreshToken.find_by(token_digest: digest).revoked_at).to be_present
      end

      it "clears the access_token cookie" do
        post "/api/v1/logout", params: { refresh_token: raw_token }

        expect(cookies[:access_token]).to be_blank
      end
    end

    context "with an invalid refresh token" do
      it "returns 422" do
        post "/api/v1/logout", params: { refresh_token: "bogus" }

        expect(response).to have_http_status(:unprocessable_content)
        expect(JSON.parse(response.body)).to include("error" => "Logout failed")
      end
    end

    context "without authentication" do
      it "returns 401" do
        cookies[:access_token] = nil
        post "/api/v1/logout", params: { refresh_token: "anything" }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
