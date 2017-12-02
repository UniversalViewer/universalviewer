
module.exports = (driver) => {
    
    loadManifest = (manifest) => {
        driver.get('http://localhost:8002/examples?manifest=' + manifest);
    }
    
}