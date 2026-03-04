# frozen_string_literal: true

class RefreshToken < ApplicationRecord
  belongs_to :user

  scope :active, -> { where(revoked_at: nil).where("expires_at > ?", Time.current) }

  def self.generate_for(user)
    raw_token = SecureRandom.hex(32)
    create!(
      user: user,
      token_digest: Digest::SHA256.hexdigest(raw_token),
      expires_at: 30.days.from_now
    )
    raw_token
  end

  def revoke!
    update!(revoked_at: Time.current)
  end
end
