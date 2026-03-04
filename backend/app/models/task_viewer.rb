# frozen_string_literal: true

class TaskViewer < ApplicationRecord
  belongs_to :task
  belongs_to :user
end
