 # Be sure to restart your server when you modify this file.

 # Read more: https://github.com/cyu/rack-cors

 Rails.application.config.middleware.insert_before 0, Rack::Cors do
   allow do
     if Rails.env.development?
       origins "http://localhost:5173"
     elsif Rails.env.production?
       origins "https://projecttracker.ivanlei.com"
     end

     resource "*",
       headers: :any,
       methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
       credentials: true
   end
 end
