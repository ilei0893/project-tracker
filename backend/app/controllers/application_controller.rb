# frozen_string_literal: true

class ApplicationController < ActionController::API
  include JWTAuthenticatable
  include ActionController::Cookies
end
