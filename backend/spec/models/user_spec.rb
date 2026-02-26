# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
    subject { User.new(email: "test@example.com", password: "password") }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).ignoring_case_sensitivity }
end
