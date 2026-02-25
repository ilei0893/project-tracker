# frozen_string_literal: true

class User < ApplicationRecord
    has_secure_password

    normalizes :email, with: -> e { e.strip.downcase }
end
