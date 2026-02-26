# frozen_string_literal: true

module AuthHelpers
  def auth_headers(token)
    { 'Authorization' => "Bearer #{token}" }
  end

  RSpec.shared_context "authenticated" do
      let(:user) { User.create!(email: "test@test.com", password: "password") }
      let(:token) do
          now = Time.now.to_i
          JWT.encode(
            { data: { id: user.id, email: user.email }, exp: now + 900, iat: now, jti: SecureRandom.uuid, sub: "User" },
            Rails.application.credentials.jwt_secret,
            "HS256"
          )
        end
    end
end
