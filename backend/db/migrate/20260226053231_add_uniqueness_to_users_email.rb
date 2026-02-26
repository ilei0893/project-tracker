# frozen_string_literal: true

class AddUniquenessToUsersEmail < ActiveRecord::Migration[8.0]
  disable_ddl_transaction!

  def up
    remove_index :users, :email
    add_index :users, :email, unique: true, algorithm: :concurrently
    add_unique_constraint :users, using_index: "index_users_on_email"
  end

  def down
    remove_unique_constraint :users, :email
  end
end
