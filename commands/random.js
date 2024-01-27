const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

const { getURL, objs } = require('../util.js')

builder = new SlashCommandBuilder()
.setName('random')
.setDescription('give a random hand sign')

async function execute(interaction) {
    const randomIdx = Math.ceil(Math.random()*101)
    const random = objs[randomIdx-1]
    const embed = new EmbedBuilder()
    .setTitle(`${random} (${randomIdx})`)
    .setThumbnail(getURL(randomIdx))

    await interaction.reply({embeds: [embed]})
}

module.exports = {
    data: builder,
    execute
}