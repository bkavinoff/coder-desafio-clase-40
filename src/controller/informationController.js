//import { args } from "../server.js"
import os from 'os'

const informationController = async(req, res) => {
  const { args } = req
  //const { username } = req.session
    const info = {
      puerto: args.port,
      plataforma: process.platform,
      versionNode: process.version,
      memoriaTotalReservada: process.memoryUsage().rss,
      pathExec: process.execPath,
      processId: process.pid,
      capetaProyecto: process.cwd(),
      cantCpus: os.cpus().length
      }

    res.render('informationTemplate.ejs', { info })
}

export { informationController }