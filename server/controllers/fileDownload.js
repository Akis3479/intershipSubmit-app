
exports.downloadFile = async (req, res) => {
    console.log(req.body.path);
    res.download("./"+req.body.path);
}