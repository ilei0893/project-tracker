# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::TasksController, type: :request do
  fixtures :tasks, :users, :task_viewers

  let(:task) { tasks(:one) }
  let(:user) { users(:one) }

  before { cookies[:access_token] = token }

  describe "GET /tasks" do
    it "returns a successful response" do
      get api_v1_tasks_url, as: :json

      expect(response).to have_http_status(:success)
    end

    it "shows viewable tasks" do
      task_viewer = task_viewers(:one)

      get api_v1_tasks_url, as: :json

      non_viewable_task = tasks(:two)
      parsed_response = JSON.parse(response.body)

      expect(parsed_response).to include(a_hash_including("title" => task.title))
      expect(parsed_response).not_to include(a_hash_including("title" => non_viewable_task.title))
    end
  end

  describe "POST /tasks" do
    it "creates a new task" do
      expect {
        post api_v1_tasks_url,
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

    it "creates a Task Viewer" do
      expect {
       post api_v1_tasks_url,
         params: {
           task: {
             author: task.author,
             description: task.description,
             state: task.state,
             title: task.title } },
         as: :json
     }.to change(TaskViewer, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe "GET /tasks/:id" do
    it "returns the task" do
      get api_v1_tasks_url(task), as: :json

      expect(response).to have_http_status(:success)
    end
  end

  describe "PATCH /tasks/:id" do
    it "updates the task" do
      patch api_v1_task_url(task),
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
        delete api_v1_task_url(task), as: :json
      }.to change(Task, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end

  context "without authentication" do
    it "returns 401 unauthorized" do
      cookies[:access_token] = nil
      get api_v1_tasks_url, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
