class Task < ApplicationRecord
    validates :title, :author, :state, presence: true
end
