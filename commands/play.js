const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

const matchups = require('../match.json')

const { getIdx, getURL, objs } = require('../util.js')
const { red, blue, gray } = require('../colors.json')

builder = new SlashCommandBuilder()
.setName('play')
.setDescription('finds the outcome of a match')
.addSubcommand((subcommand) =>
    subcommand
    .setName('computer')
    .setDescription('Play against computer')
    .addStringOption((option) => option.setName('object').setDescription('What you play against the computer').setRequired(true))
)
.addSubcommand((subcommand) =>
    subcommand
    .setName('person')
    .setDescription('Play against a person')
    .addMentionableOption((option) => option.setName('person').setDescription("The person you want to play against").setRequired(true))
    .addStringOption((option) => option.setName('object').setDescription('What you play against the person').setRequired(true))
)
async function execute(interaction) {
    if (interaction.options.getSubcommand() == 'computer') return await playComputer(interaction)
    else return await playPerson(interaction)
}

async function playComputer(interaction) {
    const playedIdx = getIdx(interaction.options.getString('object'))

    if (!playedIdx) return await interaction.reply(`Invalid input ${interaction.options.getString('object')}`)

    const randomIdx = Math.ceil(Math.random()*101)

    let diff = randomIdx - playedIdx

    // draw condition
    if (diff == 0) {
        const embed = new EmbedBuilder()
        .setTitle('Its a draw')
        .setDescription(`both objects are ${objs[randomIdx-1]} (${randomIdx})`)
        .setThumbnail(getURL(randomIdx))
        .setColor(gray)
        return await interaction.reply({embeds: [embed]})
    }

    if (diff < 0) diff += 101

    let winnerIdx = playedIdx
    let loserIdx = randomIdx
    let computerWin = false
    let color = blue
    if (51 <= diff && diff <= 100) {
        winnerIdx = randomIdx
        loserIdx = playedIdx
        computerWin = true
        color = red
    }

    const winner = objs[winnerIdx-1]
    const loser = objs[loserIdx-1]

    const winnerData = matchups.find(o=>o.object == winner)
    const reason = winnerData["winning outcomes"].find(arr => arr.includes(loser))

    let title = computerWin ? 'Computer Wins!' : 'You Win!'
    const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(`${winner} (${winnerIdx}) wins\n${winner} (${winnerIdx}) ${reason[0]} ${loser} (${loserIdx})`)
    .setThumbnail(getURL(winnerIdx))
    .setColor(color)

    await interaction.reply({embeds: [embed]})
}

async function playPerson(interaction) {
    const p1Idx = getIdx(interaction.options.getString('object'))
    const person = interaction.options.getMentionable('person')
    // console.log(person.user) // GuildMember
    if (person.user.bot) return await interaction.reply({ content: 'If you want to play against a computer use `/play computer`', ephemeral: true })
    if (!person.user) return await interaction.reply({ content: 'specify and actual person bruh', ephemeral: true })

    const reject = new ButtonBuilder()
		.setCustomId('reject')
		.setLabel('Reject match offer')
		.setStyle(ButtonStyle.Danger);

    const select1 = new StringSelectMenuBuilder()
        .setCustomId('object1')
        .setPlaceholder('Select your handsign')
        .addOptions();
    const select2 = new StringSelectMenuBuilder()
        .setCustomId('object2')
        .setPlaceholder('Select your handsign')
        .addOptions();
    const select3 = new StringSelectMenuBuilder()
        .setCustomId('object3')
        .setPlaceholder('Select your handsign')
        .addOptions();
    const select4 = new StringSelectMenuBuilder()
        .setCustomId('object4')
        .setPlaceholder('Select your handsign')
        .addOptions();

    let i = 0
    for (; i < 25; i++) {
        select1.addOptions(new StringSelectMenuOptionBuilder().setLabel(`${objs[i]} (${i+1})`).setValue(i+1+''))
    }
    for (; i < 50; i++) {
        select2.addOptions(new StringSelectMenuOptionBuilder().setLabel(`${objs[i]} (${i+1})`).setValue(i+1+''))
    }
    for (; i < 75; i++) {
        select3.addOptions(new StringSelectMenuOptionBuilder().setLabel(`${objs[i]} (${i+1})`).setValue(i+1+''))
    }
    for (; i < 100; i++) {
        select4.addOptions(new StringSelectMenuOptionBuilder().setLabel(`${objs[i]} (${i+1})`).setValue(i+1+''))
    }

    const tank = new ButtonBuilder()
        .setCustomId('helicopter')
        .setLabel('helicopter (101)')
        .setStyle(ButtonStyle.Secondary)

    const row1 = new ActionRowBuilder().addComponents(select1);
    const row2 = new ActionRowBuilder().addComponents(select2);
    const row3 = new ActionRowBuilder().addComponents(select3);
    const row4 = new ActionRowBuilder().addComponents(select4);
    const row5 = new ActionRowBuilder().addComponents(tank, reject);

    const reply = await interaction.reply({ content : `<@${person.user.id}> has 1 minute to accept the game`, components: [row1,row2,row3,row4,row5]})

    const collectorFilter = i => i.user.id === person.user.id; // only the mentioned person can interact w/ the button
    try {
        const response = await reply.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        
        if (response?.customId == 'reject')
            return await interaction.editReply({ content: `${person.user.globalName} has rejected your match request.`, components: [] });
        let p2Idx = 1;
        if (response?.values) p2Idx = parseInt(response.values[0])
        if (response?.customId == 'helicopter') p2Idx = 101
        
        let diff = p1Idx - p2Idx
        // draw condition
        if (diff == 0) {
            const embed = new EmbedBuilder()
                .setTitle('Its a draw')
                .setDescription(`both objects are ${objs[n1-1]} (${n1})`)
                .setThumbnail(getURL(n1))
                .setColor(gray)
            return await interaction.editReply({embeds: [embed], components: []})
        }

        // determine winner math - "default" is object 2 winning
        if (diff < 0) diff += 101
        let winnerIdx = p2Idx
        let loserIdx = p1Idx
        let color = red
        let winner = person.user.globalName
        let loser = interaction.user.globalName
        if (51 <= diff && diff <= 100) {
            winnerIdx = p1Idx
            loserIdx = p2Idx
            color = blue
            winner = interaction.user.globalName
            loser = person.user.globalName
        }
        const winnerObj = objs[winnerIdx-1]
        const loserObj = objs[loserIdx-1]

        // get reason
        const winnerData = matchups.find(o=>o.object == winnerObj)
        const reason = winnerData["winning outcomes"].find(arr => arr.includes(loserObj))

        const embed = new EmbedBuilder()
            .setTitle(`${winner} wins`)
            .setDescription(`${winnerObj} (${winnerIdx}) ${reason[0]} ${loserObj} (${loserIdx})\n${winner} beats ${loser}`)
            .setThumbnail(getURL(winnerIdx))
            .setColor(color)

        await interaction.editReply({embeds: [embed], components: []})

    } catch (e) {
        await interaction.editReply({ content: `${person.user.globalName} did not respond to your match request in 1 minute. Game cancelled.`, components: [] });
    }
}

module.exports = {
    data: builder,
    execute
}