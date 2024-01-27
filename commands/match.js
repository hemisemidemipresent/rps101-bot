const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

const matchups = require('../match.json')

const { getIdx, getURL, objs } = require('../util.js')
const { red, blue, gray } = require('../colors.json')

builder = new SlashCommandBuilder()
.setName('match')
.setDescription('finds the outcome of a match')
.addStringOption((option) => option.setName('object1').setDescription('object 1').setRequired(true))
.addStringOption((option) => option.setName('object2').setDescription('object 2').setRequired(true))

async function execute(interaction){
    const n1 = getIdx(interaction.options.getString('object1'))
    const n2 = getIdx(interaction.options.getString('object2'))

    if (!n1 || !n2) {
        if (!n1 && !n2) return await interaction.reply(`Invalid inputs \`${interaction.options.getString('object1')}\`, \`${interaction.options.getString('object2')}\``)
        else if (!n1) return await interaction.reply(`Invalid input \`${interaction.options.getString('object1')}\``)
        else if (!n2) return await interaction.reply(`Invalid input \`${interaction.options.getString('object2')}\``)
    }

    let diff = n1 - n2
    // draw condition
    if (diff == 0) {
        const embed = new EmbedBuilder()
        .setTitle('Its a draw')
        .setDescription(`both objects are ${objs[n1-1]} (${n1})`)
        .setThumbnail(getURL(n1))
        .setColor(gray)
        return await interaction.reply({embeds: [embed]})
    }

    // determine winner math - "default" is object 2 winning
    if (diff < 0) diff += 101
    let winnerIdx = n2
    let loserIdx = n1
    let color = red
    if (51 <= diff && diff <= 100) {
        winnerIdx = n1
        loserIdx = n2
        color = blue
    }
    const winner = objs[winnerIdx-1]
    const loser = objs[loserIdx-1]

    // get reason
    const winnerData = matchups.find(o=>o.object == winner)
    const reason = winnerData["winning outcomes"].find(arr => arr.includes(loser))

    const embed = new EmbedBuilder()
    .setTitle(`${winner} (${winnerIdx}) wins`)
    .setDescription(`${winner} (${winnerIdx}) ${reason[0]} ${loser} (${loserIdx})`)
    .setThumbnail(getURL(winnerIdx))
    .setColor(color)

    await interaction.reply({embeds: [embed]})
}

module.exports = {
    data: builder,
    execute
}