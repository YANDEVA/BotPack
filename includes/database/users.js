module.exports = function ({ api }) {
    const { writeFileSync } = require("fs-extra");
    var path = __dirname + "/data/usersData.json";

    try {
        var usersData = require(path)
    } catch {
        writeFileSync(path, "{}", { flag: 'a+' });
    }

    async function saveData(data) {
        try {
            if (!data) throw new Error('Data cannot be left blank');
            writeFileSync(path, JSON.stringify(data, null, 4))
            return true
        } catch (error) {
            return false
        }
    }

    async function getInfo(id) {
        return (await api.getUserInfo(id))[id];
    }

    async function getNameUser(userID) {
        try {
            if (!userID) throw new Error("User ID cannot be blank");
            if (isNaN(userID)) throw new Error("Invalid user ID");
            var userInfo = await api.getUserInfo(userID);
            return `User ID: ${userID}`;
        } catch (error) {
            return `Facebook users`
        }
    }

    async function getUserFull(id) {
        var resolveFunc = function () { };
        var rejectFunc = function () { };
        var returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });
        try {
            api.httpGet(`https://graph.facebook.com/${id}?fields=email,about,birthday,link&access_token=${global.account.accessToken}`, (e, i) => {
                if (e) return rejectFunc(e)
                var t = JSON.parse(i);
                var dataUser = {
                    error: 0,
                    author: 'D-Jukie',
                    data: {
                        uid: t.id || null,
                        about: t.about || null,
                        link: t.link || null,
                        imgavt: `https://graph.facebook.com/${t.id}/picture?height=1500&width=1500&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`
                    }
                };
                return resolveFunc(dataUser)
            });
            return returnPromise
        } catch (error) {
            return resolveFunc({
                error: 1,
                author: 'D-Jukie',
                data: {}
            })
        }
    }

    async function getAll(keys, callback) {
        try {
            if (!keys) {
                if (Object.keys(usersData).length == 0) return [];
                else if (Object.keys(usersData).length > 0) {
                    var db = [];
                    for (var i of Object.keys(usersData)) db.push(usersData[i]);
                    return db;
                }
            }
            if (!Array.isArray(keys)) throw new Error("The input parameter must be an array");
            const data = [];
            for (var userID in usersData) {
                var database = {
                    ID: userID
                };
                var userData = usersData[userID];
                for (var i of keys) database[i] = userData[i];
                data.push(database);
            }
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false
        }
    }

    async function getData(userID, callback) {
        try {
            if (!userID) throw new Error("User ID cannot be blank");
            if (isNaN(userID)) throw new Error("Invalid user ID");
            if (!usersData.hasOwnProperty(userID)) await createData(userID, (error, info) => {
                return info;
            });
            const data = usersData[userID];
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false
        }
    }

    async function setData(userID, options, callback) {
        try {
            if (!userID) throw new Error("User ID cannot be blank");
            if (isNaN(userID)) throw new Error("Invalid user ID");
            if (!userID) throw new Error("userID cannot be empty");
            if (global.config.autoCreateDB) {
                if (!usersData.hasOwnProperty(userID)) throw new Error(`User ID: ${userID} does not exist in Database`);
            }
            if (typeof options != 'object') throw new Error("The options parameter passed must be an object");
            usersData[userID] = { ...usersData[userID], ...options };
            await saveData(usersData);
            if (callback && typeof callback == "function") callback(null, dataUser[userID]);
            return usersData[userID];
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false
        }
    }

    async function delData(userID, callback) {
        try {
            if (!userID) throw new Error("User ID cannot be blank");
            if (isNaN(userID)) throw new Error("Invalid user ID");
            if (global.config.autoCreateDB) {
                if (!usersData.hasOwnProperty(userID)) throw new Error(`User ID: ${userID} does not exist in Database`);
            }
            delete usersData[userID];
            await saveData(usersData);
            if (callback && typeof callback == "function") callback(null, usersData);
            return usersData;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false
        }
    }

    async function createData(userID, callback) {
        try {
            if (!userID) throw new Error("User ID cannot be blank");
            if (isNaN(userID)) throw new Error("Invalid user ID");
            var userInfo = await getInfo(userID);
            if (usersData.hasOwnProperty(userID)) return false
            var data = {
                [userID]: {
                    userID: userID,
                    money: 0,
                    exp: 0,
                    createTime: {
                        timestamp: Date.now()
                    },
                    data: {
                        timestamp: Date.now()
                    },
                    lastUpdate: Date.now()
                }
            }
            Object.assign(usersData, data);
            await saveData(usersData);
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false
        }
    }

    return {
        getInfo,
        getNameUser,
        getAll,
        getData,
        setData,
        delData,
        createData,
        getUserFull
    };
};
