# Be sure to restart your server when you modify this file.


# Read more: https://github.com/cyu/rack-cors

if Rails.env.development?
  Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins "http://localhost:5173"

      resource "*",
        headers: :any,
        methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
        credentials: true
    end
  end
end
