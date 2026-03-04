# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  subject { User.new(email: "test@example.com", password: "password", first_name: "John", last_name: "Doe") }

  describe "validations" do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).ignoring_case_sensitivity }
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to have_secure_password }
  end

  describe "associations" do
    it { is_expected.to have_many(:refresh_tokens).dependent(:destroy) }
    it { is_expected.to have_many(:task_viewers).dependent(:destroy)  }
    it { is_expected.to have_many(:viewable_tasks).through(:task_viewers) }
  end

  describe "email normalization" do
    it "strips and downcases email" do
      user = User.new(email: "  TEST@Example.COM  ", password: "password", first_name: "John", last_name: "Doe")
      expect(user.email).to eq("test@example.com")
    end
  end
end
