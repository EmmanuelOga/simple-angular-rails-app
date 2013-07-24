class NotesController < ApplicationController
  before_action :set_note, only: [:show, :update, :destroy]

  # GET /notes.json
  def index
    render json: Note.all
  end

  # GET /notes/1.json
  def show
  end

  # POST /notes.json
  def create
    @note = Note.new(note_params)

    if @note.save
      render json: @note, status: :ok
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /notes/1.json
  def update
    if @note.update(note_params)
      head :no_content
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  # DELETE /notes/1.json
  def destroy
    @note.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_note
      @note = Note.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def note_params
      params.permit(:title, :body)
    end
end
