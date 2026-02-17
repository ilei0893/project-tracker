class CreateTask < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.string :description
      t.string :author, null: false
      t.string :state, null: false

      t.timestamps
    end
  end
end
