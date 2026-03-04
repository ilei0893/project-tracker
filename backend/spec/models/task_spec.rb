# frozen_string_literal: true

require "rails_helper"

RSpec.describe Task, type: :model do
  describe "validations" do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:author) }
    it { is_expected.to validate_presence_of(:state) }
  end

  describe "associations" do
    it { is_expected.to have_many(:task_viewers).dependent(:destroy)  }
    it { is_expected.to have_many(:viewers).through(:task_viewers) }
  end
end
