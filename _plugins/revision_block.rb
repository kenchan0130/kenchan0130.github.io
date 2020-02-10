require 'date'

module Jekyll
  class RevisionBlock < Liquid::Block
    TAG_NAME = 'revision'.freeze

    def initialize(tag_name, markup, token)
      super
      @date = Date.parse(markup)
    end

    def render(context)
      output = super
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      <<~HTML
        <div class="revision">
          <p class="revision-date">#{@date.strftime('%Y-%m-%d')} 追記</p>
          #{converter.convert(output)}
        </div>
      HTML
    end
  end
end

Liquid::Template.register_tag(Jekyll::RevisionBlock::TAG_NAME, Jekyll::RevisionBlock)
