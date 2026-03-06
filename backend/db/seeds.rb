# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

User.create(
  email: "user1@example.com",
  first_name: "Ariana",
  last_name: "Grande",
  password: "password"
)

User.create(
  email: "user2@example.com",
  first_name: "Bruno",
  last_name: "Mars",
  password: "password"
)

Task.create(
  title: "example title",
  description: "example description",
  author: "#{User.first.name}",
  state: "In Progress"
)

TaskViewer.create(task: Task.first, user: User.first)
