const WEB3_PROVIDER_URL = "https://mainnet.infura.io/azQq0BuFT1gejVIk558B";
const Q3D_MATCHDATA_CONTRACT_ADDRESS = "0x785839B325518b2ef6Af7384aA5DF07520bbEBc7";
const Q3D_CONTRACT_ADDRESS = "0x6f05bf7c8d50079ac864f48480a4e579189de0c6";
const GITHUB_IMAGE_URL = "https://raw.githubusercontent.com/qiulot/qiu3d/master/logos/";

function QIU3D(){
    this.web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));
    this.initContract();
    this.initMatchDataContract();
}

QIU3D.prototype.initMatchDataContract = function(){
    var _this = this;
    $.getJSON("abi/QIU3DMatchData.json", function(abiData) {
        console.log("开始加载QIU3DmatchData ABI");
        _this.q3d_matchdata_contract = new _this.web3.eth.Contract(abiData, Q3D_MATCHDATA_CONTRACT_ADDRESS);
        if(_this.q3d_matchdata_contract && _this.q3d_contract){
            _this.display();
        }
    });
}

QIU3D.prototype.initContract = function(){
    var _this = this;
    $.getJSON("abi/QIU3D.json", function(abiData) {
        console.log("开始加载QIU3D ABI");
        _this.q3d_contract = new _this.web3.eth.Contract(abiData, Q3D_CONTRACT_ADDRESS);
        if(_this.q3d_matchdata_contract && _this.q3d_contract){
            _this.display();
        }
    });
}

QIU3D.prototype.getMatch = function(callback){
    this.q3d_matchdata_contract.methods.getOpenMatch().call({
    },function(error, result){
        if(error){
            callback(false, error);
        }else{
            callback(true, result);
        }
    });
}

QIU3D.prototype.getJackpot = function(callback){
    this.q3d_contract.methods.getGameInfo().call({
    },function(error, result){
        if(error){
            callback(false, error);
        }else{
            callback(true, result);
        }
    });
}

QIU3D.prototype.getBet = function(callback){
    this.q3d_contract.methods.getBet().call({
    },function(error, result){
        if(error){
            callback(false, error);
        }else{
            callback(true, result);
        }
    });
}

QIU3D.prototype.display = function(){
    var _this = this;
    this.getMatch(function(isSuccess, data){
        if(isSuccess){
            $("#homeTeam").html(data[3]);
            $("#awayTeam").html(data[4]);
            $("#homeTeamLogo").attr("src", GITHUB_IMAGE_URL + data[1] + ".png");
            $("#awayTeamLogo").attr("src", GITHUB_IMAGE_URL + data[2] + ".png");
    
            _this.getBet(function(isSuccess, betData){
                if(isSuccess){
                    $("#betHomeTeam").html(data[3] + "<br>" + (betData[1]/100).toFixed(2));
                    $("#betDraw").html("平<br>" + (betData[2]/100).toFixed(2));
                    $("#awayHomeTeam").html(data[4] + "<br>" + (betData[3]/100).toFixed(2));
                }
            });
        }
    });

    this.getJackpot(function(isSuccess, data){
        if(isSuccess){
            var ticketJackpot = _this.web3.utils.fromWei(data[3], "ether");
            var betJackpot = _this.web3.utils.fromWei(data[4], "ether");
            var jackpot = parseFloat(ticketJackpot) + parseFloat(betJackpot);
            $("#jackpot").html(jackpot.toFixed(4));
        }
    })

}
