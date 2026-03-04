# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  has_person_name
  has_many :refresh_tokens, dependent: :destroy
  has_many :task_viewers, dependent: :destroy
  has_many :viewable_tasks, through: :task_viewers, source: :task

  normalizes :email, with: ->(e) { e.strip.downcase }
  validates :email, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true
end
