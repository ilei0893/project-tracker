# frozen_string_literal: true

require "rails_helper"

RSpec.describe RefreshToken, type: :model do
  let(:user) { User.create!(email: "test@example.com", password: "password", first_name: "John", last_name: "Doe") }
  let(:raw_token) { described_class.generate_for(user) }
  let(:digest) { digest = Digest::SHA256.hexdigest(raw_token) }

  describe "associations" do
    it { is_expected.to belong_to(:user) }
  end

  describe ".generate_for" do
    it "returns a raw token string" do
      expect(raw_token).to be_a(String)
      expect(raw_token.length).to eq(64)
    end

    it "creates a refresh token record for the user" do
      expect { described_class.generate_for(user) }.to change { user.refresh_tokens.count }.by(1)
    end

    it "stores the token as a SHA256 digest" do
      expected_digest = Digest::SHA256.hexdigest(raw_token)
      expect(user.refresh_tokens.last.token_digest).to eq(expected_digest)
    end

    it "sets expires_at to approximately 30 days from now" do
      described_class.generate_for(user)
      expect(user.refresh_tokens.last.expires_at).to be_within(1.second).of(30.days.from_now)
    end
  end

  describe ".active" do
    it "returns tokens that are not revoked and not expired" do
      active_token = described_class.find_by(token_digest: digest)

      expect(described_class.active).to include(active_token)
    end

    it "excludes revoked tokens" do
      token = described_class.find_by(token_digest: digest)
      token.revoke!

      expect(described_class.active).not_to include(token)
    end

    it "excludes expired tokens" do
      token = described_class.find_by(token_digest: digest)
      token.update!(expires_at: 1.day.ago)

      expect(described_class.active).not_to include(token)
    end
  end

  describe "#revoke!" do
    it "sets revoked_at to the current time" do
      token = described_class.find_by(token_digest: digest)

      token.revoke!

      expect(token.reload.revoked_at).to be_within(1.second).of(Time.current)
    end
  end
end
