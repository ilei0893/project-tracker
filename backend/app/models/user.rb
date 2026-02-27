# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  has_person_name

  normalizes :email, with: ->(e) { e.strip.downcase }
  validates :email, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true
end
