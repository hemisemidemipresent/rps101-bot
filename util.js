const gifs = [19, 36, 40, 49, 55, 76, 85, 86, 89, 91]

module.exports = {
    getSimplestName(name) {
        return name.toLowerCase().replaceAll('.','')
    },
    getURL(id) {
        let mediaType = 'png'
        if (gifs.includes(id)) mediaType = 'gif'
        return `https://rps101.pythonanywhere.com/static/${id}.${mediaType}`
    },
    getIdx(str) {
        str = module.exports.getSimplestName(str)
        if (!isNaN(str) && 1 <= parseInt(str) && parseInt(str) <= 101) return parseInt(str)
        const arrayIndex = module.exports.objs.findIndex(s=> s==str)
        if (arrayIndex != -1) return arrayIndex+1
        return
    },
    objs: ["dynamite","tornado","quicksand","pit","chain","gun","law","whip","sword","rock","death","wall","sun","camera","fire","chainsaw","school","scissors","poison","cage","axe","peace","computer","castle","snake","blood","porcupine","vulture","monkey","king","queen","prince","princess","police","woman","baby","man","home","train","car","noise","bicycle","tree","turnip","duck","wolf","cat","bird","fish","spider","cockroach","brain","community","cross","money","vampire","sponge","church","butter","book","paper","cloud","airplane","moon","grass","film","toilet","air","planet","guitar","bowl","cup","beer","rain","water","tv","rainbow","ufo","alien","prayer","mountain","satan","dragon","diamond","platinum","gold","devil","fence","video game","math","robot","heart","electricity","lightning","medusa","power","laser","nuke","sky","tank","helicopter"]
}