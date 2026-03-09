# frozen_string_literal: true

class Api::V1::AuthController < ApplicationController
  allow_unauthenticated_access only: [:login, :register, :refresh]

  def login
    @current_user = User.find_by(email: login_params[:email])

    if @current_user && @current_user.authenticate(login_params[:password])
      token = encode(@current_user)
      refresh_token = RefreshToken.generate_for(@current_user)
      set_access_token_cookie(token)
      render json: { refresh_token: refresh_token, user: user_json(@current_user) }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def refresh
    raw_token = params[:refresh_token]
    digest = Digest::SHA256.hexdigest(raw_token.to_s)
    existing = RefreshToken.active.find_by(token_digest: digest)

    if existing
      existing.revoke!
      token = encode(existing.user)
      new_refresh_token = RefreshToken.generate_for(existing.user)
      set_access_token_cookie(token)
      render json: { refresh_token: new_refresh_token, user: user_json(existing.user) }, status: :ok
    else
      render json: { error: "Invalid or expired refresh token" }, status: :unauthorized
    end
  end

  def register
    user = User.new(register_params)

    if user.save
      head :created
    else
      render json: user.errors.messages, status: :unprocessable_content
    end
  end

  def logout
    raw_token = params[:refresh_token]
    digest = Digest::SHA256.hexdigest(raw_token.to_s)
    existing = RefreshToken.active.find_by(token_digest: digest)

    if existing
      existing.revoke!
      cookies.delete(:access_token)
      head :ok
    else
      render json: { error: "Logout failed" }, status: :unprocessable_content
    end
  end

    private

      def login_params
        params.expect(auth: [:email, :password])
      end

      def register_params
        params.expect(auth: [:email, :password, :password_confirmation, :first_name, :last_name])
      end

      def set_access_token_cookie(token)
        cookies[:access_token] = {
          value: token,
          httponly: true,
          same_site: :lax,
          expires: 15.minutes.from_now
        }
      end

      def user_json(user)
        {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      end
end
