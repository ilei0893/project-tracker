# frozen_string_literal: true

class Task < ApplicationRecord
  validates :title, :author, :state, presence: true
  has_many :task_viewers, dependent: :destroy
  has_many :viewers, through: :task_viewers, source: :user
end
