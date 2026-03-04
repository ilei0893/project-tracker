# frozen_string_literal: true

require "rails_helper"

RSpec.describe TaskViewer, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:task) }
    it { is_expected.to belong_to(:user) }
  end
end
