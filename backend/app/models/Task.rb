# frozen_string_literal: true

class Task < ApplicationRecord
    validates :title, :author, :state, presence: true
end
