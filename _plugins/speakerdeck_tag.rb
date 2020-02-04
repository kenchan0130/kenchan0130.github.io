# Description: Output an iframe tag for speakerdeck
#
# Syntax
#    {% speakerdeck 13a9c0e9ea434de282612805a55672f9 %}
#    {% speakerdeck 13a9c0e9ea434de282612805a55672f9 10 %}
#
module Jekyll
  class SpeakerdeckTag < Liquid::Tag
    TAG_NAME = 'speakerdeck'.freeze

    def initialize(tag_name, markup, tokens)
      super
      # strip leading and trailing spaces
      @markup = markup.strip.tap do |m|
        raise ArgumentError, "Error processing input, expected syntax lile: {% #{TAG_NAME} filename post_id %}" if m.empty?
      end
    end

    def render(context)
      slide_id, slide_number = determine_arguments
      slide_number ||= 1

      iframe_attributes = {
        src: "//speakerdeck.com/player/#{slide_id}?slide=#{slide_number}",
        class: 'speakerdeck-iframe',
        frameborder: 0,
        allowfullscreen: true,
        mozallowfullscreen: true,
        webkitallowfullscreen: true
      }.map { |k, v| "#{k}='#{v}'" }.join("\u0020")

      "<iframe #{iframe_attributes}></iframe>"
    end

    private

    def determine_arguments
      matched = @markup.match(%r{\A([\S]+|.*(?=\/).+)\s?(\S*)\Z})
      [matched[1], matched[2]].map(&:strip) if matched && matched.length >= 3
    end
  end
end

Liquid::Template.register_tag(Jekyll::SpeakerdeckTag::TAG_NAME, Jekyll::SpeakerdeckTag)
