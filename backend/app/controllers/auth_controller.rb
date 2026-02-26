# frozen_string_literal: true

class AuthController < ApplicationController
    def login
        user = User.new(login_params)
    end

    def register
        user = User.new(register_params)

        if user.save
            head :created
        else
            render json: user.errors.full_messages, status: :unprocessable_entity
        end
    end

    private

    def login_params
        params.permit(:email, :password)
    end

    def register_params
        params.permit(:email, :password, :password_confirmation)
    end
end
