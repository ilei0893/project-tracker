# frozen_string_literal: true

class Api::V1::AuthController < ApplicationController
  allow_unauthenticated_access only: [:login, :register]

  def login
    @current_user = User.find_by(email: login_params[:email])

    if @current_user && @current_user.authenticate(login_params[:password])
      token = encode(@current_user)
      render json: { token: token }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def register
    user = User.new(register_params)

    if user.save
      head :created
    else
      render json: user.errors.full_messages, status: :unprocessable_content
    end
  end

    private

      def login_params
        params.expect(auth: [:email, :password])
      end

      def register_params
        params.expect(auth: [:email, :password, :password_confirmation])
      end
end
