# frozen_string_literal: true

module AuthHelpers
  def auth_headers(token)
    { 'Authorization' => "Bearer #{token}" }
  end

  def auth_cookies(token)
    { 'access_token' => token }
  end

  RSpec.shared_context "authenticated" do
      let(:token) do
          now = Time.now.to_i
          JWT.encode(
            {
              data: { id: user.id, email: user.email },
              exp: now + 900,
              iat: now,
              jti: SecureRandom.uuid,
              sub: "User" },
            Rails.application.credentials.jwt_secret,
            "HS256"
          )
        end
    end
end
