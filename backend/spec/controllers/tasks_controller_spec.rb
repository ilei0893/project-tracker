# frozen_string_literal: true

require "rails_helper"

RSpec.describe TasksController, type: :request do
  fixtures :tasks

  let(:task) { tasks(:one) }

  describe "GET /tasks" do
    it "returns a successful response" do
      get tasks_url, as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /tasks" do
    it "creates a new task" do
      expect {
        post tasks_url,
             params: {
               task: {
                 author: task.author,
                 description: task.description,
                 state: task.state,
                 title: task.title } },
             as: :json
      }.to change(Task, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe "GET /tasks/:id" do
    it "returns the task" do
      get task_url(task), as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe "PATCH /tasks/:id" do
    it "updates the task" do
      patch task_url(task),
            params: {
              task: {
                author: task.author,
                description: task.description,
                state: task.state,
                title: task.title } },
            as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe "DELETE /tasks/:id" do
    it "destroys the task" do
      expect {
        delete task_url(task), as: :json
      }.to change(Task, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
