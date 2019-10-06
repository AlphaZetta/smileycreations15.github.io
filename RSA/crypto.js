(function(){
    var moduleCache = {};var assets = {};var privateBundleData = {};
    moduleCache["2-factor-auth.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\n// 2 factor auth\nfunction makeid(length) {\n   var result           = \"\";\n   var characters       = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\";\n   var charactersLength = characters.length;\n   for ( var i = 0; i < length; i++ ) {\n      result += characters.charAt(Math.floor(Math.random() * charactersLength));\n   }\n   return result;\n}\nfunction encode(string) {\n    var number = \"0x\";\n    var length = string.length;\n    for (var i = 0; i < length; i++){ number += string.charCodeAt(i).toString(16);};\n    return number;\n}\nfunction decode(number) {\n    var string = \"\";\n    number = number.slice(2);\n    var length = number.length;\n    for (var i = 0; i < length;) {\n        var code = number.slice(i, i += 2);\n        string += String.fromCharCode(parseInt(code, 16));\n    }\n    return string;\n}\nsmilejs.sha = loadModule(\"sha.js\");\nsmilejs.genToken = function(secret, validity,length = 6){\n	var encoded = BigInt(encode(secret));\n	var time = BigInt(Math.floor(new Date().getTime() / validity));\n	var secretOut = [secret,time,encoded,encoded * time];\n	var hashedSecret = smilejs.sha.sha512(secretOut.join(\"\"));\n	var hashes = hashedSecret.match(/.{2,2}/g);\n	var hashOut = 0;\n	for (var i = 0;i !== hashes.length;i++){\n		hashOut += Number(\"0x\" + hashes[i]);\n	}\n	var a = String(hashOut * Math.floor(new Date().getTime() / validity)).split(\"\");\n	a.splice(0,1 + ((a.length - 1) - length));\n	return a.join(\"\");\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/2-factor-auth.js';
    moduleCache["blockchain.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nvar pow = loadModule(\"proof-of-work.js\")\nvar { sha512 } = loadModule(\'sha.js\');\nmodule.exports.Block = class Block {\n  constructor(data, previousHash = \'\') {\n    this.previousHash = previousHash;\n    this.timestamp = Number(new Date());\n    this.data = data;\n    this.hash = \"\";\n    this.nonce = 0;\n  }\n  mineBlock(difficulty,prevHash) {\n    var res = pow.solve(JSON.stringify({data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}),difficulty)\n    this.pow = res\n    this.nonce = Number(res.split(\"x\")[1])\n    this.previousHash = prevHash\n    this.hash = sha512(JSON.stringify({nonce:this.nonce,data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}))\n  }\n  calculateHash(){\n    return sha512(JSON.stringify({nonce:this.nonce,data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}))\n  }\n}\nmodule.exports.RemoteBlock = class RemoteBlock {\n  constructor(obj) {\n    this.previousHash = obj.previousHash;\n    this.timestamp = obj.timestamp;\n    this.data = obj.data;\n    this.hash = obj.hash;\n    this.nonce = obj.nonce;\n    this.pow = obj.pow;\n  }\n  calculateHash(){\n    return sha512(JSON.stringify({nonce:this.nonce,data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}))\n  }\n}\nmodule.exports.Blockchain = class Blockchain {\n  constructor(difficulty) {\n    this.chain = [this.createGenesisBlock()];\n    this.difficulty = difficulty\n  }\n  createGenesisBlock(){\n    return new module.exports.Block(null);\n  }\n  getLatestBlock(){\n    return this.chain[this.chain.length - 1];\n  }\n  addBlock(block){\n    var newBlock = block\n    block.mineBlock(this.difficulty,this.getLatestBlock().hash)\n    this.chain.push(newBlock);\n  }\n  isChainValid(){\n    for (let i = 1; i < this.chain.length; i++){\n      if (this.chain[i].previousHash !== this.chain[i - 1].hash) return false;\n      if (this.chain[i].hash !== this.chain[i].calculateHash()) return false;\n      if (pow.verify(JSON.stringify({data:this.chain[i].data,timestamp:this.chain[i].timestamp,previousHash:this.chain[i].previousHash}),this.chain[i].pow))\n      if (String(this.chain[i].nonce) !== this.chain[i].pow.split(\"x\")[1]) return false\n    }\n    if (this.chain[0].data === null) return true;\n    return false\n  }\n}\nmodule.exports.RemoteBlockchain = class RemoteBlockchain {\n  constructor(obj) {\n    this.chain = [new module.exports.Block(null)];\n    for (var i = 1;i !== obj.chain.length;i++){\n      this.chain[this.chain.length] = new module.exports.RemoteBlock(obj.chain[i])\n    }\n    this.difficulty = obj.difficulty\n  }\n  getLatestBlock(){\n    return this.chain[this.chain.length - 1];\n  }\n  addBlock(block){\n    var newBlock = block\n    block.mineBlock(this.difficulty,this.getLatestBlock().hash)\n\n    this.chain.push(newBlock);\n  }\n  isChainValid(){\n    for (let i = 1; i < this.chain.length; i++){\n      if (this.chain[i].previousHash !== this.chain[i - 1].hash) return false;\n      if (this.chain[i].hash !== this.chain[i].calculateHash()) return false;\n      if (pow.verify(JSON.stringify({data:this.chain[i].data,timestamp:this.chain[i].timestamp,previousHash:this.chain[i].previousHash}),this.chain[i].pow))\n      if (String(this.chain[i].nonce) !== this.chain[i].pow.split(\"x\")[1]) return false\n    }\n    if (this.chain[0].data === null) return true;\n    return false\n  }\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/blockchain.js';
    moduleCache["chess-knight.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nmodule.exports = function chessKnight(cell) {\n    var possibleCoordinates = [];\n    var xCoordinates = [\'a\', \'b\', \'c\', \'d\', \'e\', \'f\', \'g\', \'h\'];\n    var cellX = xCoordinates.indexOf(cell[0]) + 1; //The X Position\n    var cellY = parseInt(cell[1]); //The Y Position\n\n\n//Find all possible X Positions\n    var cellXpositions = [cellX + 2, cellX - 2, cellX + 1, cellX - 1].filter(function(cellPosition) {\n        return (cellPosition > 0 && cellPosition < 9);\n    })\n\n\n//Find all possible Y Positions\n    var cellYpositions = [cellY + 2, cellY - 2, cellY + 1, cellY - 1].filter(function(cellPosition) {\n        return (cellPosition > 0 && cellPosition < 9);\n    })\n\n\n//We now have 2 seperate arrays: One for X Positions, One for Y Positions.\n    //Go thru every combination possible and if it is a valid position then push it\n    //to the possible coordinates array - if not present already.\n    //The trick is to validate the position pair (X, Y) by making sure that\n    //the net X distance plus net Y distance is 3\n\n    for (var i = 0; i < cellXpositions.length; i++) {\n        for (var j = 0; j < cellYpositions.length; j++) {\n            if (Math.abs(cellX - cellXpositions[i]) + Math.abs(cellY - cellYpositions[j]) === 3) {\n                if (!possibleCoordinates.includes([[xCoordinates[cellXpositions[i]]], cellYpositions[j]])) {\n                    possibleCoordinates.push([[xCoordinates[cellXpositions[i]]], cellYpositions[j]].join(\"\"));\n                }\n            }\n        }\n    }\n    return possibleCoordinates;\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/chess-knight.js';
    moduleCache["chess.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\n\nvar Chess = function(fen) {\n  var BLACK = \'b\';\n  var WHITE = \'w\';\n\n  var EMPTY = -1;\n\n  var PAWN = \'p\';\n  var KNIGHT = \'n\';\n  var BISHOP = \'b\';\n  var ROOK = \'r\';\n  var QUEEN = \'q\';\n  var KING = \'k\';\n\n  var SYMBOLS = \'pnbrqkPNBRQK\';\n\n  var DEFAULT_POSITION =\n    \'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\';\n\n  var POSSIBLE_RESULTS = [\'1-0\', \'0-1\', \'1/2-1/2\', \'*\'];\n\n  var PAWN_OFFSETS = {\n    b: [16, 32, 17, 15],\n    w: [-16, -32, -17, -15]\n  };\n\n  var PIECE_OFFSETS = {\n    n: [-18, -33, -31, -14, 18, 33, 31, 14],\n    b: [-17, -15, 17, 15],\n    r: [-16, 1, 16, -1],\n    q: [-17, -16, -15, 1, 17, 16, 15, -1],\n    k: [-17, -16, -15, 1, 17, 16, 15, -1]\n  };\n\n  // prettier-ignore\n  var ATTACKS = [\n    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,\n     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,\n     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,\n     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,\n     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,\n     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,\n     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,\n    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,\n     0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,\n     0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,\n     0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,\n     0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,\n     0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,\n     0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,\n    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20\n  ];\n\n  // prettier-ignore\n  var RAYS = [\n     17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,\n      0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,\n      0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,\n      0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,\n      0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,\n      0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,\n      0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,\n      1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,\n      0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,\n      0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,\n      0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,\n      0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,\n      0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,\n      0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,\n    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17\n  ];\n\n  var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };\n\n  var FLAGS = {\n    NORMAL: \'n\',\n    CAPTURE: \'c\',\n    BIG_PAWN: \'b\',\n    EP_CAPTURE: \'e\',\n    PROMOTION: \'p\',\n    KSIDE_CASTLE: \'k\',\n    QSIDE_CASTLE: \'q\'\n  };\n\n  var BITS = {\n    NORMAL: 1,\n    CAPTURE: 2,\n    BIG_PAWN: 4,\n    EP_CAPTURE: 8,\n    PROMOTION: 16,\n    KSIDE_CASTLE: 32,\n    QSIDE_CASTLE: 64\n  };\n\n  var RANK_1 = 7;\n  var RANK_2 = 6;\n  var RANK_3 = 5;\n  var RANK_4 = 4;\n  var RANK_5 = 3;\n  var RANK_6 = 2;\n  var RANK_7 = 1;\n  var RANK_8 = 0;\n\n  // prettier-ignore\n  var SQUARES = {\n    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,\n    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,\n    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,\n    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,\n    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,\n    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,\n    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,\n    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119\n  };\n\n  var ROOKS = {\n    w: [\n      { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },\n      { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }\n    ],\n    b: [\n      { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },\n      { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }\n    ]\n  };\n\n  var board = new Array(128);\n  var kings = { w: EMPTY, b: EMPTY };\n  var turn = WHITE;\n  var castling = { w: 0, b: 0 };\n  var ep_square = EMPTY;\n  var half_moves = 0;\n  var move_number = 1;\n  var history = [];\n  var header = {};\n\n  /* if the user passes in a fen string, load it, else default to\n   * starting position\n   */\n  if (typeof fen === \'undefined\') {\n    load(DEFAULT_POSITION);\n  } else {\n    load(fen);\n  }\n\n  function clear(keep_headers) {\n    if (typeof keep_headers === \'undefined\') {\n      keep_headers = false;\n    }\n\n    board = new Array(128);\n    kings = { w: EMPTY, b: EMPTY };\n    turn = WHITE;\n    castling = { w: 0, b: 0 };\n    ep_square = EMPTY;\n    half_moves = 0;\n    move_number = 1;\n    history = [];\n    if (!keep_headers) header = {};\n    update_setup(generate_fen());\n  }\n\n  function reset() {\n    load(DEFAULT_POSITION);\n  }\n\n  function load(fen, keep_headers) {\n    if (typeof keep_headers === \'undefined\') {\n      keep_headers = false;\n    }\n\n    var tokens = fen.split(/\\s+/);\n    var position = tokens[0];\n    var square = 0;\n\n    if (!validate_fen(fen).valid) {\n      return false;\n    }\n\n    clear(keep_headers);\n\n    for (var i = 0; i < position.length; i++) {\n      var piece = position.charAt(i);\n\n      if (piece === \'/\') {\n        square += 8;\n      } else if (is_digit(piece)) {\n        square += parseInt(piece, 10);\n      } else {\n        var color = piece < \'a\' ? WHITE : BLACK;\n        put({ type: piece.toLowerCase(), color: color }, algebraic(square));\n        square++;\n      }\n    }\n\n    turn = tokens[1];\n\n    if (tokens[2].indexOf(\'K\') > -1) {\n      castling.w |= BITS.KSIDE_CASTLE;\n    }\n    if (tokens[2].indexOf(\'Q\') > -1) {\n      castling.w |= BITS.QSIDE_CASTLE;\n    }\n    if (tokens[2].indexOf(\'k\') > -1) {\n      castling.b |= BITS.KSIDE_CASTLE;\n    }\n    if (tokens[2].indexOf(\'q\') > -1) {\n      castling.b |= BITS.QSIDE_CASTLE;\n    }\n\n    ep_square = tokens[3] === \'-\' ? EMPTY : SQUARES[tokens[3]];\n    half_moves = parseInt(tokens[4], 10);\n    move_number = parseInt(tokens[5], 10);\n\n    update_setup(generate_fen());\n\n    return true;\n  }\n\n  /* TODO: this function is pretty much crap - it validates structure but\n   * completely ignores content (e.g. doesn\'t verify that each side has a king)\n   * ... we should rewrite this, and ditch the silly error_number field while\n   * we\'re at it\n   */\n  function validate_fen(fen) {\n    var errors = {\n      0: \'No errors.\',\n      1: \'FEN string must contain six space-delimited fields.\',\n      2: \'6th field (move number) must be a positive integer.\',\n      3: \'5th field (half move counter) must be a non-negative integer.\',\n      4: \'4th field (en-passant square) is invalid.\',\n      5: \'3rd field (castling availability) is invalid.\',\n      6: \'2nd field (side to move) is invalid.\',\n      7: \"1st field (piece positions) does not contain 8 \'/\'-delimited rows.\",\n      8: \'1st field (piece positions) is invalid [consecutive numbers].\',\n      9: \'1st field (piece positions) is invalid [invalid piece].\',\n      10: \'1st field (piece positions) is invalid [row too large].\',\n      11: \'Illegal en-passant square\'\n    };\n\n    /* 1st criterion: 6 space-seperated fields? */\n    var tokens = fen.split(/\\s+/);\n    if (tokens.length !== 6) {\n      return { valid: false, error_number: 1, error: errors[1] };\n    }\n\n    /* 2nd criterion: move number field is a integer value > 0? */\n    if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {\n      return { valid: false, error_number: 2, error: errors[2] };\n    }\n\n    /* 3rd criterion: half move counter is an integer >= 0? */\n    if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {\n      return { valid: false, error_number: 3, error: errors[3] };\n    }\n\n    /* 4th criterion: 4th field is a valid e.p.-string? */\n    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {\n      return { valid: false, error_number: 4, error: errors[4] };\n    }\n\n    /* 5th criterion: 3th field is a valid castle-string? */\n    if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {\n      return { valid: false, error_number: 5, error: errors[5] };\n    }\n\n    /* 6th criterion: 2nd field is \"w\" (white) or \"b\" (black)? */\n    if (!/^(w|b)$/.test(tokens[1])) {\n      return { valid: false, error_number: 6, error: errors[6] };\n    }\n\n    /* 7th criterion: 1st field contains 8 rows? */\n    var rows = tokens[0].split(\'/\');\n    if (rows.length !== 8) {\n      return { valid: false, error_number: 7, error: errors[7] };\n    }\n\n    /* 8th criterion: every row is valid? */\n    for (var i = 0; i < rows.length; i++) {\n      /* check for right sum of fields AND not two numbers in succession */\n      var sum_fields = 0;\n      var previous_was_number = false;\n\n      for (var k = 0; k < rows[i].length; k++) {\n        if (!isNaN(rows[i][k])) {\n          if (previous_was_number) {\n            return { valid: false, error_number: 8, error: errors[8] };\n          }\n          sum_fields += parseInt(rows[i][k], 10);\n          previous_was_number = true;\n        } else {\n          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {\n            return { valid: false, error_number: 9, error: errors[9] };\n          }\n          sum_fields += 1;\n          previous_was_number = false;\n        }\n      }\n      if (sum_fields !== 8) {\n        return { valid: false, error_number: 10, error: errors[10] };\n      }\n    }\n\n    if (\n      (tokens[3][1] == \'3\' && tokens[1] == \'w\') ||\n      (tokens[3][1] == \'6\' && tokens[1] == \'b\')\n    ) {\n      return { valid: false, error_number: 11, error: errors[11] };\n    }\n\n    /* everything\'s okay! */\n    return { valid: true, error_number: 0, error: errors[0] };\n  }\n\n  function generate_fen() {\n    var empty = 0;\n    var fen = \'\';\n\n    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {\n      if (board[i] == null) {\n        empty++;\n      } else {\n        if (empty > 0) {\n          fen += empty;\n          empty = 0;\n        }\n        var color = board[i].color;\n        var piece = board[i].type;\n\n        fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();\n      }\n\n      if ((i + 1) & 0x88) {\n        if (empty > 0) {\n          fen += empty;\n        }\n\n        if (i !== SQUARES.h1) {\n          fen += \'/\';\n        }\n\n        empty = 0;\n        i += 8;\n      }\n    }\n\n    var cflags = \'\';\n    if (castling[WHITE] & BITS.KSIDE_CASTLE) {\n      cflags += \'K\';\n    }\n    if (castling[WHITE] & BITS.QSIDE_CASTLE) {\n      cflags += \'Q\';\n    }\n    if (castling[BLACK] & BITS.KSIDE_CASTLE) {\n      cflags += \'k\';\n    }\n    if (castling[BLACK] & BITS.QSIDE_CASTLE) {\n      cflags += \'q\';\n    }\n\n    /* do we have an empty castling flag? */\n    cflags = cflags || \'-\';\n    var epflags = ep_square === EMPTY ? \'-\' : algebraic(ep_square);\n\n    return [fen, turn, cflags, epflags, half_moves, move_number].join(\' \');\n  }\n\n  function set_header(args) {\n    for (var i = 0; i < args.length; i += 2) {\n      if (typeof args[i] === \'string\' && typeof args[i + 1] === \'string\') {\n        header[args[i]] = args[i + 1];\n      }\n    }\n    return header;\n  }\n\n  /* called when the initial board setup is changed with put() or remove().\n   * modifies the SetUp and FEN properties of the header object.  if the FEN is\n   * equal to the default position, the SetUp and FEN are deleted\n   * the setup is only updated if history.length is zero, ie moves haven\'t been\n   * made.\n   */\n  function update_setup(fen) {\n    if (history.length > 0) return;\n\n    if (fen !== DEFAULT_POSITION) {\n      header[\'SetUp\'] = \'1\';\n      header[\'FEN\'] = fen;\n    } else {\n      delete header[\'SetUp\'];\n      delete header[\'FEN\'];\n    }\n  }\n\n  function get(square) {\n    var piece = board[SQUARES[square]];\n    return piece ? { type: piece.type, color: piece.color } : null;\n  }\n\n  function put(piece, square) {\n    /* check for valid piece object */\n    if (!(\'type\' in piece && \'color\' in piece)) {\n      return false;\n    }\n\n    /* check for piece */\n    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {\n      return false;\n    }\n\n    /* check for valid square */\n    if (!(square in SQUARES)) {\n      return false;\n    }\n\n    var sq = SQUARES[square];\n\n    /* don\'t let the user place more than one king */\n    if (\n      piece.type == KING &&\n      !(kings[piece.color] == EMPTY || kings[piece.color] == sq)\n    ) {\n      return false;\n    }\n\n    board[sq] = { type: piece.type, color: piece.color };\n    if (piece.type === KING) {\n      kings[piece.color] = sq;\n    }\n\n    update_setup(generate_fen());\n\n    return true;\n  }\n\n  function remove(square) {\n    var piece = get(square);\n    board[SQUARES[square]] = null;\n    if (piece && piece.type === KING) {\n      kings[piece.color] = EMPTY;\n    }\n\n    update_setup(generate_fen());\n\n    return piece;\n  }\n\n  function build_move(board, from, to, flags, promotion) {\n    var move = {\n      color: turn,\n      from: from,\n      to: to,\n      flags: flags,\n      piece: board[from].type\n    };\n\n    if (promotion) {\n      move.flags |= BITS.PROMOTION;\n      move.promotion = promotion;\n    }\n\n    if (board[to]) {\n      move.captured = board[to].type;\n    } else if (flags & BITS.EP_CAPTURE) {\n      move.captured = PAWN;\n    }\n    return move;\n  }\n\n  function generate_moves(options) {\n    function add_move(board, moves, from, to, flags) {\n      /* if pawn promotion */\n      if (\n        board[from].type === PAWN &&\n        (rank(to) === RANK_8 || rank(to) === RANK_1)\n      ) {\n        var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];\n        for (var i = 0, len = pieces.length; i < len; i++) {\n          moves.push(build_move(board, from, to, flags, pieces[i]));\n        }\n      } else {\n        moves.push(build_move(board, from, to, flags));\n      }\n    }\n\n    var moves = [];\n    var us = turn;\n    var them = swap_color(us);\n    var second_rank = { b: RANK_7, w: RANK_2 };\n\n    var first_sq = SQUARES.a8;\n    var last_sq = SQUARES.h1;\n    var single_square = false;\n\n    /* do we want legal moves? */\n    var legal =\n      typeof options !== \'undefined\' && \'legal\' in options\n        ? options.legal\n        : true;\n\n    /* are we generating moves for a single square? */\n    if (typeof options !== \'undefined\' && \'square\' in options) {\n      if (options.square in SQUARES) {\n        first_sq = last_sq = SQUARES[options.square];\n        single_square = true;\n      } else {\n        /* invalid square */\n        return [];\n      }\n    }\n\n    for (var i = first_sq; i <= last_sq; i++) {\n      /* did we run off the end of the board */\n      if (i & 0x88) {\n        i += 7;\n        continue;\n      }\n\n      var piece = board[i];\n      if (piece == null || piece.color !== us) {\n        continue;\n      }\n\n      if (piece.type === PAWN) {\n        /* single square, non-capturing */\n        var square = i + PAWN_OFFSETS[us][0];\n        if (board[square] == null) {\n          add_move(board, moves, i, square, BITS.NORMAL);\n\n          /* double square */\n          var square = i + PAWN_OFFSETS[us][1];\n          if (second_rank[us] === rank(i) && board[square] == null) {\n            add_move(board, moves, i, square, BITS.BIG_PAWN);\n          }\n        }\n\n        /* pawn captures */\n        for (j = 2; j < 4; j++) {\n          var square = i + PAWN_OFFSETS[us][j];\n          if (square & 0x88) continue;\n\n          if (board[square] != null && board[square].color === them) {\n            add_move(board, moves, i, square, BITS.CAPTURE);\n          } else if (square === ep_square) {\n            add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);\n          }\n        }\n      } else {\n        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {\n          var offset = PIECE_OFFSETS[piece.type][j];\n          var square = i;\n\n          while (true) {\n            square += offset;\n            if (square & 0x88) break;\n\n            if (board[square] == null) {\n              add_move(board, moves, i, square, BITS.NORMAL);\n            } else {\n              if (board[square].color === us) break;\n              add_move(board, moves, i, square, BITS.CAPTURE);\n              break;\n            }\n\n            /* break, if knight or king */\n            if (piece.type === \'n\' || piece.type === \'k\') break;\n          }\n        }\n      }\n    }\n\n    /* check for castling if: a) we\'re generating all moves, or b) we\'re doing\n     * single square move generation on the king\'s square\n     */\n    if (!single_square || last_sq === kings[us]) {\n      /* king-side castling */\n      if (castling[us] & BITS.KSIDE_CASTLE) {\n        var castling_from = kings[us];\n        var castling_to = castling_from + 2;\n\n        if (\n          board[castling_from + 1] == null &&\n          board[castling_to] == null &&\n          !attacked(them, kings[us]) &&\n          !attacked(them, castling_from + 1) &&\n          !attacked(them, castling_to)\n        ) {\n          add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);\n        }\n      }\n\n      /* queen-side castling */\n      if (castling[us] & BITS.QSIDE_CASTLE) {\n        var castling_from = kings[us];\n        var castling_to = castling_from - 2;\n\n        if (\n          board[castling_from - 1] == null &&\n          board[castling_from - 2] == null &&\n          board[castling_from - 3] == null &&\n          !attacked(them, kings[us]) &&\n          !attacked(them, castling_from - 1) &&\n          !attacked(them, castling_to)\n        ) {\n          add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);\n        }\n      }\n    }\n\n    /* return all pseudo-legal moves (this includes moves that allow the king\n     * to be captured)\n     */\n    if (!legal) {\n      return moves;\n    }\n\n    /* filter out illegal moves */\n    var legal_moves = [];\n    var i = 0, len = moves.length\n    while (i < len) {\n      make_move(moves[i]);\n      if (!king_attacked(us)) {\n        legal_moves.push(moves[i]);\n      }\n      undo_move();\n      i++\n    }\n\n    return legal_moves;\n  }\n\n  /* convert a move from 0x88 coordinates to Standard Algebraic Notation\n   * (SAN)\n   *\n   * @param {boolean} sloppy Use the sloppy SAN generator to work around over\n   * disambiguation bugs in Fritz and Chessbase.  See below:\n   *\n   * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4\n   * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned\n   * 4. ... Ne7 is technically the valid SAN\n   */\n  function move_to_san(move, sloppy) {\n    var output = \'\';\n\n    if (move.flags & BITS.KSIDE_CASTLE) {\n      output = \'O-O\';\n    } else if (move.flags & BITS.QSIDE_CASTLE) {\n      output = \'O-O-O\';\n    } else {\n      var disambiguator = get_disambiguator(move, sloppy);\n\n      if (move.piece !== PAWN) {\n        output += move.piece.toUpperCase() + disambiguator;\n      }\n\n      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {\n        if (move.piece === PAWN) {\n          output += algebraic(move.from)[0];\n        }\n        output += \'x\';\n      }\n\n      output += algebraic(move.to);\n\n      if (move.flags & BITS.PROMOTION) {\n        output += \'=\' + move.promotion.toUpperCase();\n      }\n    }\n\n    make_move(move);\n    if (in_check()) {\n      if (in_checkmate()) {\n        output += \'#\';\n      } else {\n        output += \'+\';\n      }\n    }\n    undo_move();\n\n    return output;\n  }\n\n  // parses all of the decorators out of a SAN string\n  function stripped_san(move) {\n    return move.replace(/=/, \'\').replace(/[+#]?[?!]*$/, \'\');\n  }\n\n  function attacked(color, square) {\n    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {\n      /* did we run off the end of the board */\n      if (i & 0x88) {\n        i += 7;\n        continue;\n      }\n\n      /* if empty square or wrong color */\n      if (board[i] == null || board[i].color !== color) continue;\n\n      var piece = board[i];\n      var difference = i - square;\n      var index = difference + 119;\n\n      if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {\n        if (piece.type === PAWN) {\n          if (difference > 0) {\n            if (piece.color === WHITE) return true;\n          } else {\n            if (piece.color === BLACK) return true;\n          }\n          continue;\n        }\n\n        /* if the piece is a knight or a king */\n        if (piece.type === \'n\' || piece.type === \'k\') return true;\n\n        var offset = RAYS[index];\n        var j = i + offset;\n\n        var blocked = false;\n        while (j !== square) {\n          if (board[j] != null) {\n            blocked = true;\n            break;\n          }\n          j += offset;\n        }\n\n        if (!blocked) return true;\n      }\n    }\n\n    return false;\n  }\n\n  function king_attacked(color) {\n    return attacked(swap_color(color), kings[color]);\n  }\n\n  function in_check() {\n    return king_attacked(turn);\n  }\n\n  function in_checkmate() {\n    return in_check() && generate_moves().length === 0;\n  }\n\n  function in_stalemate() {\n    return !in_check() && generate_moves().length === 0;\n  }\n\n  function insufficient_material() {\n    var pieces = {};\n    var bishops = [];\n    var num_pieces = 0;\n    var sq_color = 0;\n\n    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {\n      sq_color = (sq_color + 1) % 2;\n      if (i & 0x88) {\n        i += 7;\n        continue;\n      }\n\n      var piece = board[i];\n      if (piece) {\n        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;\n        if (piece.type === BISHOP) {\n          bishops.push(sq_color);\n        }\n        num_pieces++;\n      }\n    }\n\n    /* k vs. k */\n    if (num_pieces === 2) {\n      return true;\n    } else if (\n      /* k vs. kn .... or .... k vs. kb */\n      num_pieces === 3 &&\n      (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)\n    ) {\n      return true;\n    } else if (num_pieces === pieces[BISHOP] + 2) {\n      /* kb vs. kb where any number of bishops are all on the same color */\n      var sum = 0;\n      var len = bishops.length;\n      for (var i = 0; i < len; i++) {\n        sum += bishops[i];\n      }\n      if (sum === 0 || sum === len) {\n        return true;\n      }\n    }\n\n    return false;\n  }\n\n  function in_threefold_repetition() {\n    /* TODO: while this function is fine for casual use, a better\n     * implementation would use a Zobrist key (instead of FEN). the\n     * Zobrist key would be maintained in the make_move/undo_move functions,\n     * avoiding the costly that we do below.\n     */\n    var moves = [];\n    var positions = {};\n    var repetition = false;\n\n    while (true) {\n      var move = undo_move();\n      if (!move) break;\n      moves.push(move);\n    }\n\n    while (true) {\n      /* remove the last two fields in the FEN string, they\'re not needed\n       * when checking for draw by rep */\n      var fen = generate_fen()\n        .split(\' \')\n        .slice(0, 4)\n        .join(\' \');\n\n      /* has the position occurred three or move times */\n      positions[fen] = fen in positions ? positions[fen] + 1 : 1;\n      if (positions[fen] >= 3) {\n        repetition = true;\n      }\n\n      if (!moves.length) {\n        break;\n      }\n      make_move(moves.pop());\n    }\n\n    return repetition;\n  }\n\n  function push(move) {\n    history.push({\n      move: move,\n      kings: { b: kings.b, w: kings.w },\n      turn: turn,\n      castling: { b: castling.b, w: castling.w },\n      ep_square: ep_square,\n      half_moves: half_moves,\n      move_number: move_number\n    });\n  }\n\n  function make_move(move) {\n    var us = turn;\n    var them = swap_color(us);\n    push(move);\n\n    board[move.to] = board[move.from];\n    board[move.from] = null;\n\n    /* if ep capture, remove the captured pawn */\n    if (move.flags & BITS.EP_CAPTURE) {\n      if (turn === BLACK) {\n        board[move.to - 16] = null;\n      } else {\n        board[move.to + 16] = null;\n      }\n    }\n\n    /* if pawn promotion, replace with new piece */\n    if (move.flags & BITS.PROMOTION) {\n      board[move.to] = { type: move.promotion, color: us };\n    }\n\n    /* if we moved the king */\n    if (board[move.to].type === KING) {\n      kings[board[move.to].color] = move.to;\n\n      /* if we castled, move the rook next to the king */\n      if (move.flags & BITS.KSIDE_CASTLE) {\n        var castling_to = move.to - 1;\n        var castling_from = move.to + 1;\n        board[castling_to] = board[castling_from];\n        board[castling_from] = null;\n      } else if (move.flags & BITS.QSIDE_CASTLE) {\n        var castling_to = move.to + 1;\n        var castling_from = move.to - 2;\n        board[castling_to] = board[castling_from];\n        board[castling_from] = null;\n      }\n\n      /* turn off castling */\n      castling[us] = \'\';\n    }\n\n    /* turn off castling if we move a rook */\n    if (castling[us]) {\n      for (var i = 0, len = ROOKS[us].length; i < len; i++) {\n        if (\n          move.from === ROOKS[us][i].square &&\n          castling[us] & ROOKS[us][i].flag\n        ) {\n          castling[us] ^= ROOKS[us][i].flag;\n          break;\n        }\n      }\n    }\n\n    /* turn off castling if we capture a rook */\n    if (castling[them]) {\n      for (var i = 0, len = ROOKS[them].length; i < len; i++) {\n        if (\n          move.to === ROOKS[them][i].square &&\n          castling[them] & ROOKS[them][i].flag\n        ) {\n          castling[them] ^= ROOKS[them][i].flag;\n          break;\n        }\n      }\n    }\n\n    /* if big pawn move, update the en passant square */\n    if (move.flags & BITS.BIG_PAWN) {\n      if (turn === \'b\') {\n        ep_square = move.to - 16;\n      } else {\n        ep_square = move.to + 16;\n      }\n    } else {\n      ep_square = EMPTY;\n    }\n\n    /* reset the 50 move counter if a pawn is moved or a piece is captured */\n    if (move.piece === PAWN) {\n      half_moves = 0;\n    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {\n      half_moves = 0;\n    } else {\n      half_moves++;\n    }\n\n    if (turn === BLACK) {\n      move_number++;\n    }\n    turn = swap_color(turn);\n  }\n\n  function undo_move() {\n    var old = history.pop();\n    if (old == null) {\n      return null;\n    }\n\n    var move = old.move;\n    kings = old.kings;\n    turn = old.turn;\n    castling = old.castling;\n    ep_square = old.ep_square;\n    half_moves = old.half_moves;\n    move_number = old.move_number;\n\n    var us = turn;\n    var them = swap_color(turn);\n\n    board[move.from] = board[move.to];\n    board[move.from].type = move.piece; // to undo any promotions\n    board[move.to] = null;\n\n    if (move.flags & BITS.CAPTURE) {\n      board[move.to] = { type: move.captured, color: them };\n    } else if (move.flags & BITS.EP_CAPTURE) {\n      var index;\n      if (us === BLACK) {\n        index = move.to - 16;\n      } else {\n        index = move.to + 16;\n      }\n      board[index] = { type: PAWN, color: them };\n    }\n\n    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {\n      var castling_to, castling_from;\n      if (move.flags & BITS.KSIDE_CASTLE) {\n        castling_to = move.to + 1;\n        castling_from = move.to - 1;\n      } else if (move.flags & BITS.QSIDE_CASTLE) {\n        castling_to = move.to - 2;\n        castling_from = move.to + 1;\n      }\n\n      board[castling_to] = board[castling_from];\n      board[castling_from] = null;\n    }\n\n    return move;\n  }\n\n  /* this function is used to uniquely identify ambiguous moves */\n  function get_disambiguator(move, sloppy) {\n    var moves = generate_moves({ legal: !sloppy });\n\n    var from = move.from;\n    var to = move.to;\n    var piece = move.piece;\n\n    var ambiguities = 0;\n    var same_rank = 0;\n    var same_file = 0;\n\n    for (var i = 0, len = moves.length; i < len; i++) {\n      var ambig_from = moves[i].from;\n      var ambig_to = moves[i].to;\n      var ambig_piece = moves[i].piece;\n\n      /* if a move of the same piece type ends on the same to square, we\'ll\n       * need to add a disambiguator to the algebraic notation\n       */\n      if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {\n        ambiguities++;\n\n        if (rank(from) === rank(ambig_from)) {\n          same_rank++;\n        }\n\n        if (file(from) === file(ambig_from)) {\n          same_file++;\n        }\n      }\n    }\n\n    if (ambiguities > 0) {\n      /* if there exists a similar moving piece on the same rank and file as\n       * the move in question, use the square as the disambiguator\n       */\n      if (same_rank > 0 && same_file > 0) {\n        return algebraic(from);\n      } else if (same_file > 0) {\n        /* if the moving piece rests on the same file, use the rank symbol as the\n       * disambiguator\n       */\n        return algebraic(from).charAt(1);\n      } else {\n        /* else use the file symbol */\n        return algebraic(from).charAt(0);\n      }\n    }\n\n    return \'\';\n  }\n\n  function ascii() {\n    var s = \'   +------------------------+\\n\';\n    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {\n      /* display the rank */\n      if (file(i) === 0) {\n        s += \' \' + \'87654321\'[rank(i)] + \' |\';\n      }\n\n      /* empty piece */\n      if (board[i] == null) {\n        s += \' . \';\n      } else {\n        var piece = board[i].type;\n        var color = board[i].color;\n        var symbol =\n          color === WHITE ? piece.toUpperCase() : piece.toLowerCase();\n        s += \' \' + symbol + \' \';\n      }\n\n      if ((i + 1) & 0x88) {\n        s += \'|\\n\';\n        i += 8;\n      }\n    }\n    s += \'   +------------------------+\\n\';\n    s += \'     a  b  c  d  e  f  g  h\\n\';\n\n    return s;\n  }\n\n  // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates\n  function move_from_san(move, sloppy) {\n    // strip off any move decorations: e.g Nf3+?!\n    var clean_move = stripped_san(move);\n\n    // if we\'re using the sloppy parser run a regex to grab piece, to, and from\n    // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7\n    if (sloppy) {\n      var matches = clean_move.match(\n        /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/\n      );\n      if (matches) {\n        var piece = matches[1];\n        var from = matches[2];\n        var to = matches[3];\n        var promotion = matches[4];\n      }\n    }\n\n    var moves = generate_moves();\n    for (var i = 0, len = moves.length; i < len; i++) {\n      // try the strict parser first, then the sloppy parser if requested\n      // by the user\n      if (\n        clean_move === stripped_san(move_to_san(moves[i])) ||\n        (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))\n      ) {\n        return moves[i];\n      } else {\n        if (\n          matches &&\n          (!piece || piece.toLowerCase() == moves[i].piece) &&\n          SQUARES[from] == moves[i].from &&\n          SQUARES[to] == moves[i].to &&\n          (!promotion || promotion.toLowerCase() == moves[i].promotion)\n        ) {\n          return moves[i];\n        }\n      }\n    }\n\n    return null;\n  }\n\n  /*****************************************************************************\n   * UTILITY FUNCTIONS\n   ****************************************************************************/\n  function rank(i) {\n    return i >> 4;\n  }\n\n  function file(i) {\n    return i & 15;\n  }\n\n  function algebraic(i) {\n    var f = file(i),\n      r = rank(i);\n    return \'abcdefgh\'.substring(f, f + 1) + \'87654321\'.substring(r, r + 1);\n  }\n\n  function swap_color(c) {\n    return c === WHITE ? BLACK : WHITE;\n  }\n\n  function is_digit(c) {\n    return \'0123456789\'.indexOf(c) !== -1;\n  }\n\n  /* pretty = external move object */\n  function make_pretty(ugly_move) {\n    var move = clone(ugly_move);\n    move.san = move_to_san(move, false);\n    move.to = algebraic(move.to);\n    move.from = algebraic(move.from);\n\n    var flags = \'\';\n\n    for (var flag in BITS) {\n      if (BITS[flag] & move.flags) {\n        flags += FLAGS[flag];\n      }\n    }\n    move.flags = flags;\n\n    return move;\n  }\n\n  function clone(obj) {\n    var dupe = obj instanceof Array ? [] : {};\n\n    for (var property in obj) {\n      if (typeof property === \'object\') {\n        dupe[property] = clone(obj[property]);\n      } else {\n        dupe[property] = obj[property];\n      }\n    }\n\n    return dupe;\n  }\n\n  function trim(str) {\n    return str.replace(/^\\s+|\\s+$/g, \'\');\n  }\n\n  /*****************************************************************************\n   * DEBUGGING UTILITIES\n   ****************************************************************************/\n  function perft(depth) {\n    var moves = generate_moves({ legal: false });\n    var nodes = 0;\n    var color = turn;\n\n    for (var i = 0, len = moves.length; i < len; i++) {\n      make_move(moves[i]);\n      if (!king_attacked(color)) {\n        if (depth - 1 > 0) {\n          var child_nodes = perft(depth - 1);\n          nodes += child_nodes;\n        } else {\n          nodes++;\n        }\n      }\n      undo_move();\n    }\n\n    return nodes;\n  }\n\n  return {\n    /***************************************************************************\n     * PUBLIC CONSTANTS (is there a better way to do this?)\n     **************************************************************************/\n    WHITE: WHITE,\n    BLACK: BLACK,\n    PAWN: PAWN,\n    KNIGHT: KNIGHT,\n    BISHOP: BISHOP,\n    ROOK: ROOK,\n    QUEEN: QUEEN,\n    KING: KING,\n    SQUARES: (function() {\n      /* from the ECMA-262 spec (section 12.6.4):\n                 * \"The mechanics of enumerating the properties ... is\n                 * implementation dependent\"\n                 * so: for (var sq in SQUARES) { keys.push(sq); } might not be\n                 * ordered correctly\n                 */\n      var keys = [];\n      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {\n        if (i & 0x88) {\n          i += 7;\n          continue;\n        }\n        keys.push(algebraic(i));\n      }\n      return keys;\n    })(),\n    FLAGS: FLAGS,\n\n    /***************************************************************************\n     * PUBLIC API\n     **************************************************************************/\n    load: function(fen) {\n      return load(fen);\n    },\n\n    reset: function() {\n      return reset();\n    },\n\n    moves: function(options) {\n      /* The internal representation of a chess move is in 0x88 format, and\n       * not meant to be human-readable.  The code below converts the 0x88\n       * square coordinates to algebraic coordinates.  It also prunes an\n       * unnecessary move keys resulting from a verbose call.\n       */\n\n      var ugly_moves = generate_moves(options);\n      var moves = [];\n\n      for (var i = 0, len = ugly_moves.length; i < len; i++) {\n        /* does the user want a full move object (most likely not), or just\n         * SAN\n         */\n        if (\n          typeof options !== \'undefined\' &&\n          \'verbose\' in options &&\n          options.verbose\n        ) {\n          moves.push(make_pretty(ugly_moves[i]));\n        } else {\n          moves.push(move_to_san(ugly_moves[i], false));\n        }\n      }\n\n      return moves;\n    },\n\n    in_check: function() {\n      return in_check();\n    },\n\n    in_checkmate: function() {\n      return in_checkmate();\n    },\n\n    in_stalemate: function() {\n      return in_stalemate();\n    },\n\n    in_draw: function() {\n      return (\n        half_moves >= 100 ||\n        in_stalemate() ||\n        insufficient_material() ||\n        in_threefold_repetition()\n      );\n    },\n\n    insufficient_material: function() {\n      return insufficient_material();\n    },\n\n    in_threefold_repetition: function() {\n      return in_threefold_repetition();\n    },\n\n    game_over: function() {\n      return (\n        half_moves >= 100 ||\n        in_checkmate() ||\n        in_stalemate() ||\n        insufficient_material() ||\n        in_threefold_repetition()\n      );\n    },\n\n    validate_fen: function(fen) {\n      return validate_fen(fen);\n    },\n\n    fen: function() {\n      return generate_fen();\n    },\n\n    board: function() {\n      var output = [],\n        row = [];\n\n      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {\n        if (board[i] == null) {\n          row.push(null);\n        } else {\n          row.push({ type: board[i].type, color: board[i].color });\n        }\n        if ((i + 1) & 0x88) {\n          output.push(row);\n          row = [];\n          i += 8;\n        }\n      }\n\n      return output;\n    },\n\n    pgn: function(options) {\n      /* using the specification from http://www.chessclub.com/help/PGN-spec\n       * example for html usage: .pgn({ max_width: 72, newline_char: \"<br />\" })\n       */\n      var newline =\n        typeof options === \'object\' && typeof options.newline_char === \'string\'\n          ? options.newline_char\n          : \'\\n\';\n      var max_width =\n        typeof options === \'object\' && typeof options.max_width === \'number\'\n          ? options.max_width\n          : 0;\n      var result = [];\n      var header_exists = false;\n\n      /* add the PGN header headerrmation */\n      for (var i in header) {\n        /* TODO: order of enumerated properties in header object is not\n         * guaranteed, see ECMA-262 spec (section 12.6.4)\n         */\n        result.push(\'[\' + i + \' \"\' + header[i] + \'\"]\' + newline);\n        header_exists = true;\n      }\n\n      if (header_exists && history.length) {\n        result.push(newline);\n      }\n\n      /* pop all of history onto reversed_history */\n      var reversed_history = [];\n      while (history.length > 0) {\n        reversed_history.push(undo_move());\n      }\n\n      var moves = [];\n      var move_string = \'\';\n\n      /* build the list of moves.  a move_string looks like: \"3. e3 e6\" */\n      while (reversed_history.length > 0) {\n        var move = reversed_history.pop();\n\n        /* if the position started with black to move, start PGN with 1. ... */\n        if (!history.length && move.color === \'b\') {\n          move_string = move_number + \'. ...\';\n        } else if (move.color === \'w\') {\n          /* store the previous generated move_string if we have one */\n          if (move_string.length) {\n            moves.push(move_string);\n          }\n          move_string = move_number + \'.\';\n        }\n\n        move_string = move_string + \' \' + move_to_san(move, false);\n        make_move(move);\n      }\n\n      /* are there any other leftover moves? */\n      if (move_string.length) {\n        moves.push(move_string);\n      }\n\n      /* is there a result? */\n      if (typeof header.Result !== \'undefined\') {\n        moves.push(header.Result);\n      }\n\n      /* history should be back to what is was before we started generating PGN,\n       * so join together moves\n       */\n      if (max_width === 0) {\n        return result.join(\'\') + moves.join(\' \');\n      }\n\n      /* wrap the PGN output at max_width */\n      var current_width = 0;\n      for (var i = 0; i < moves.length; i++) {\n        /* if the current move will push past max_width */\n        if (current_width + moves[i].length > max_width && i !== 0) {\n          /* don\'t end the line with whitespace */\n          if (result[result.length - 1] === \' \') {\n            result.pop();\n          }\n\n          result.push(newline);\n          current_width = 0;\n        } else if (i !== 0) {\n          result.push(\' \');\n          current_width++;\n        }\n        result.push(moves[i]);\n        current_width += moves[i].length;\n      }\n\n      return result.join(\'\');\n    },\n\n    load_pgn: function(pgn, options) {\n      // allow the user to specify the sloppy move parser to work around over\n      // disambiguation bugs in Fritz and Chessbase\n      var sloppy =\n        typeof options !== \'undefined\' && \'sloppy\' in options\n          ? options.sloppy\n          : false;\n\n      function mask(str) {\n        return str.replace(/\\\\/g, \'\\\\\');\n      }\n\n      function has_keys(object) {\n        for (var key in object) {\n          return true;\n        }\n        return false;\n      }\n\n      function parse_pgn_header(header, options) {\n        var newline_char =\n          typeof options === \'object\' &&\n          typeof options.newline_char === \'string\'\n            ? options.newline_char\n            : \'\\r?\\n\';\n        var header_obj = {};\n        var headers = header.split(new RegExp(mask(newline_char)));\n        var key = \'\';\n        var value = \'\';\n\n        for (var i = 0; i < headers.length; i++) {\n          key = headers[i].replace(/^\\[([A-Z][A-Za-z]*)\\s.*\\]$/, \'$1\');\n          value = headers[i].replace(/^\\[[A-Za-z]+\\s\"(.*)\"\\]$/, \'$1\');\n          if (trim(key).length > 0) {\n            header_obj[key] = value;\n          }\n        }\n\n        return header_obj;\n      }\n\n      var newline_char =\n        typeof options === \'object\' && typeof options.newline_char === \'string\'\n          ? options.newline_char\n          : \'\\r?\\n\';\n\n      // RegExp to split header. Takes advantage of the fact that header and movetext\n      // will always have a blank line between them (ie, two newline_char\'s).\n      // With default newline_char, will equal: /^(\\[((?:\\r?\\n)|.)*\\])(?:\\r?\\n){2}/\n      var header_regex = new RegExp(\n        \'^(\\\\[((?:\' +\n          mask(newline_char) +\n          \')|.)*\\\\])\' +\n          \'(?:\' +\n          mask(newline_char) +\n          \'){2}\'\n      );\n\n      // If no header given, begin with moves.\n      var header_string = header_regex.test(pgn)\n        ? header_regex.exec(pgn)[1]\n        : \'\';\n\n      // Put the board in the starting position\n      reset();\n\n      /* parse PGN header */\n      var headers = parse_pgn_header(header_string, options);\n      for (var key in headers) {\n        set_header([key, headers[key]]);\n      }\n\n      /* load the starting position indicated by [Setup \'1\'] and\n      * [FEN position] */\n      if (headers[\'SetUp\'] === \'1\') {\n        if (!(\'FEN\' in headers && load(headers[\'FEN\'], true))) {\n          // second argument to load: don\'t clear the headers\n          return false;\n        }\n      }\n\n      /* delete header to get the moves */\n      var ms = pgn\n        .replace(header_string, \'\')\n        .replace(new RegExp(mask(newline_char), \'g\'), \' \');\n\n      /* delete comments */\n      ms = ms.replace(/(\\{[^}]+\\})+?/g, \'\');\n\n      /* delete recursive annotation variations */\n      var rav_regex = /(\\([^\\(\\)]+\\))+?/g;\n      while (rav_regex.test(ms)) {\n        ms = ms.replace(rav_regex, \'\');\n      }\n\n      /* delete move numbers */\n      ms = ms.replace(/\\d+\\.(\\.\\.)?/g, \'\');\n\n      /* delete ... indicating black to move */\n      ms = ms.replace(/\\.\\.\\./g, \'\');\n\n      /* delete numeric annotation glyphs */\n      ms = ms.replace(/\\$\\d+/g, \'\');\n\n      /* trim and get array of moves */\n      var moves = trim(ms).split(new RegExp(/\\s+/));\n\n      /* delete empty entries */\n      moves = moves\n        .join(\',\')\n        .replace(/,,+/g, \',\')\n        .split(\',\');\n      var move = \'\';\n\n      for (var half_move = 0; half_move < moves.length - 1; half_move++) {\n        move = move_from_san(moves[half_move], sloppy);\n\n        /* move not possible! (don\'t clear the board to examine to show the\n         * latest valid position)\n         */\n        if (move == null) {\n          return false;\n        } else {\n          make_move(move);\n        }\n      }\n\n      /* examine last move */\n      move = moves[moves.length - 1];\n      if (POSSIBLE_RESULTS.indexOf(move) > -1) {\n        if (has_keys(header) && typeof header.Result === \'undefined\') {\n          set_header([\'Result\', move]);\n        }\n      } else {\n        move = move_from_san(move, sloppy);\n        if (move == null) {\n          return false;\n        } else {\n          make_move(move);\n        }\n      }\n      return true;\n    },\n\n    header: function() {\n      return set_header(arguments);\n    },\n\n    ascii: function() {\n      return ascii();\n    },\n\n    turn: function() {\n      return turn;\n    },\n\n    move: function(move, options) {\n      /* The move function can be called with in the following parameters:\n       *\n       * .move(\'Nxb7\')      <- where \'move\' is a case-sensitive SAN string\n       *\n       * .move({ from: \'h7\', <- where the \'move\' is a move object (additional\n       *         to :\'h8\',      fields are ignored)\n       *         promotion: \'q\',\n       *      })\n       */\n\n      // allow the user to specify the sloppy move parser to work around over\n      // disambiguation bugs in Fritz and Chessbase\n      var sloppy =\n        typeof options !== \'undefined\' && \'sloppy\' in options\n          ? options.sloppy\n          : false;\n\n      var move_obj = null;\n\n      if (typeof move === \'string\') {\n        move_obj = move_from_san(move, sloppy);\n      } else if (typeof move === \'object\') {\n        var moves = generate_moves();\n\n        /* convert the pretty move object to an ugly move object */\n        for (var i = 0, len = moves.length; i < len; i++) {\n          if (\n            move.from === algebraic(moves[i].from) &&\n            move.to === algebraic(moves[i].to) &&\n            (!(\'promotion\' in moves[i]) ||\n              move.promotion === moves[i].promotion)\n          ) {\n            move_obj = moves[i];\n            break;\n          }\n        }\n      }\n\n      /* failed to find move */\n      if (!move_obj) {\n        return null;\n      }\n\n      /* need to make a copy of move because we can\'t generate SAN after the\n       * move is made\n       */\n      var pretty_move = make_pretty(move_obj);\n\n      make_move(move_obj);\n\n      return pretty_move;\n    },\n\n    undo: function() {\n      var move = undo_move();\n      return move ? make_pretty(move) : null;\n    },\n\n    clear: function() {\n      return clear();\n    },\n\n    put: function(piece, square) {\n      return put(piece, square);\n    },\n\n    get: function(square) {\n      return get(square);\n    },\n\n    remove: function(square) {\n      return remove(square);\n    },\n\n    perft: function(depth) {\n      return perft(depth);\n    },\n\n    square_color: function(square) {\n      if (square in SQUARES) {\n        var sq_0x88 = SQUARES[square];\n        return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? \'light\' : \'dark\';\n      }\n\n      return null;\n    },\n\n    history: function(options) {\n      var reversed_history = [];\n      var move_history = [];\n      var verbose =\n        typeof options !== \'undefined\' &&\n        \'verbose\' in options &&\n        options.verbose;\n\n      while (history.length > 0) {\n        reversed_history.push(undo_move());\n      }\n\n      while (reversed_history.length > 0) {\n        var move = reversed_history.pop();\n        if (verbose) {\n          move_history.push(make_pretty(move));\n        } else {\n          move_history.push(move_to_san(move));\n        }\n        make_move(move);\n      }\n\n      return move_history;\n    }\n  };\n};\n\n/* export Chess object if using node or any other CommonJS compatible\n * environment */\nif (typeof exports !== \'undefined\') exports.Chess = Chess;\n/* export Chess object for any RequireJS compatible environment */\nif (typeof define !== \'undefined\')\n  define(function() {\n    return Chess;\n  });\nmodule.exports = Chess\n\n//# sourceURL=smileycreations15://smilejs/modules/chess.js';
    moduleCache["compress.js"] = 'module.exports = (function() {\n\n// private property\nvar f = String.fromCharCode;\nvar keyStrBase64 = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\";\nvar keyStrUriSafe = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$\";\nvar baseReverseDic = {};\n\nfunction getBaseValue(alphabet, character) {\n  if (!baseReverseDic[alphabet]) {\n    baseReverseDic[alphabet] = {};\n    for (var i=0 ; i<alphabet.length ; i++) {\n      baseReverseDic[alphabet][alphabet.charAt(i)] = i;\n    }\n  }\n  return baseReverseDic[alphabet][character];\n}\n\nvar LZString = {\n  compressToBase64 : function (input) {\n    if (input == null) return \"\";\n    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});\n    switch (res.length % 4) { // To produce valid Base64\n    default: // When could this happen ?\n    case 0 : return res;\n    case 1 : return res+\"===\";\n    case 2 : return res+\"==\";\n    case 3 : return res+\"=\";\n    }\n  },\n\n  decompressFromBase64 : function (input) {\n    if (input == null) return \"\";\n    if (input == \"\") return null;\n    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });\n  },\n\n  compressToUTF16 : function (input) {\n    if (input == null) return \"\";\n    return LZString._compress(input, 15, function(a){return f(a+32);}) + \" \";\n  },\n\n  decompressFromUTF16: function (compressed) {\n    if (compressed == null) return \"\";\n    if (compressed == \"\") return null;\n    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });\n  },\n\n  //compress into uint8array (UCS-2 big endian format)\n  compressToUint8Array: function (uncompressed) {\n    var compressed = LZString.compress(uncompressed);\n    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character\n\n    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {\n      var current_value = compressed.charCodeAt(i);\n      buf[i*2] = current_value >>> 8;\n      buf[i*2+1] = current_value % 256;\n    }\n    return buf;\n  },\n\n  //decompress from uint8array (UCS-2 big endian format)\n  decompressFromUint8Array:function (compressed) {\n    if (compressed===null || compressed===undefined){\n        return LZString.decompress(compressed);\n    } else {\n        var buf=new Array(compressed.length/2); // 2 bytes per character\n        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {\n          buf[i]=compressed[i*2]*256+compressed[i*2+1];\n        }\n\n        var result = [];\n        buf.forEach(function (c) {\n          result.push(f(c));\n        });\n        return LZString.decompress(result.join(\'\'));\n\n    }\n\n  },\n\n\n  //compress into a string that is already URI encoded\n  compressToEncodedURIComponent: function (input) {\n    if (input == null) return \"\";\n    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});\n  },\n\n  //decompress from an output of compressToEncodedURIComponent\n  decompressFromEncodedURIComponent:function (input) {\n    if (input == null) return \"\";\n    if (input == \"\") return null;\n    input = input.replace(/ /g, \"+\");\n    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });\n  },\n\n  compress: function (uncompressed) {\n    return LZString._compress(uncompressed, 16, function(a){return f(a);});\n  },\n  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {\n    if (uncompressed == null) return \"\";\n    var i, value,\n        context_dictionary= {},\n        context_dictionaryToCreate= {},\n        context_c=\"\",\n        context_wc=\"\",\n        context_w=\"\",\n        context_enlargeIn= 2, // Compensate for the first entry which should not count\n        context_dictSize= 3,\n        context_numBits= 2,\n        context_data=[],\n        context_data_val=0,\n        context_data_position=0,\n        ii;\n\n    for (ii = 0; ii < uncompressed.length; ii += 1) {\n      context_c = uncompressed.charAt(ii);\n      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {\n        context_dictionary[context_c] = context_dictSize++;\n        context_dictionaryToCreate[context_c] = true;\n      }\n\n      context_wc = context_w + context_c;\n      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {\n        context_w = context_wc;\n      } else {\n        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {\n          if (context_w.charCodeAt(0)<256) {\n            for (i=0 ; i<context_numBits ; i++) {\n              context_data_val = (context_data_val << 1);\n              if (context_data_position == bitsPerChar-1) {\n                context_data_position = 0;\n                context_data.push(getCharFromInt(context_data_val));\n                context_data_val = 0;\n              } else {\n                context_data_position++;\n              }\n            }\n            value = context_w.charCodeAt(0);\n            for (i=0 ; i<8 ; i++) {\n              context_data_val = (context_data_val << 1) | (value&1);\n              if (context_data_position == bitsPerChar-1) {\n                context_data_position = 0;\n                context_data.push(getCharFromInt(context_data_val));\n                context_data_val = 0;\n              } else {\n                context_data_position++;\n              }\n              value = value >> 1;\n            }\n          } else {\n            value = 1;\n            for (i=0 ; i<context_numBits ; i++) {\n              context_data_val = (context_data_val << 1) | value;\n              if (context_data_position ==bitsPerChar-1) {\n                context_data_position = 0;\n                context_data.push(getCharFromInt(context_data_val));\n                context_data_val = 0;\n              } else {\n                context_data_position++;\n              }\n              value = 0;\n            }\n            value = context_w.charCodeAt(0);\n            for (i=0 ; i<16 ; i++) {\n              context_data_val = (context_data_val << 1) | (value&1);\n              if (context_data_position == bitsPerChar-1) {\n                context_data_position = 0;\n                context_data.push(getCharFromInt(context_data_val));\n                context_data_val = 0;\n              } else {\n                context_data_position++;\n              }\n              value = value >> 1;\n            }\n          }\n          context_enlargeIn--;\n          if (context_enlargeIn == 0) {\n            context_enlargeIn = Math.pow(2, context_numBits);\n            context_numBits++;\n          }\n          delete context_dictionaryToCreate[context_w];\n        } else {\n          value = context_dictionary[context_w];\n          for (i=0 ; i<context_numBits ; i++) {\n            context_data_val = (context_data_val << 1) | (value&1);\n            if (context_data_position == bitsPerChar-1) {\n              context_data_position = 0;\n              context_data.push(getCharFromInt(context_data_val));\n              context_data_val = 0;\n            } else {\n              context_data_position++;\n            }\n            value = value >> 1;\n          }\n\n\n        }\n        context_enlargeIn--;\n        if (context_enlargeIn == 0) {\n          context_enlargeIn = Math.pow(2, context_numBits);\n          context_numBits++;\n        }\n        // Add wc to the dictionary.\n        context_dictionary[context_wc] = context_dictSize++;\n        context_w = String(context_c);\n      }\n    }\n\n    // Output the code for w.\n    if (context_w !== \"\") {\n      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {\n        if (context_w.charCodeAt(0)<256) {\n          for (i=0 ; i<context_numBits ; i++) {\n            context_data_val = (context_data_val << 1);\n            if (context_data_position == bitsPerChar-1) {\n              context_data_position = 0;\n              context_data.push(getCharFromInt(context_data_val));\n              context_data_val = 0;\n            } else {\n              context_data_position++;\n            }\n          }\n          value = context_w.charCodeAt(0);\n          for (i=0 ; i<8 ; i++) {\n            context_data_val = (context_data_val << 1) | (value&1);\n            if (context_data_position == bitsPerChar-1) {\n              context_data_position = 0;\n              context_data.push(getCharFromInt(context_data_val));\n              context_data_val = 0;\n            } else {\n              context_data_position++;\n            }\n            value = value >> 1;\n          }\n        } else {\n          value = 1;\n          for (i=0 ; i<context_numBits ; i++) {\n            context_data_val = (context_data_val << 1) | value;\n            if (context_data_position == bitsPerChar-1) {\n              context_data_position = 0;\n              context_data.push(getCharFromInt(context_data_val));\n              context_data_val = 0;\n            } else {\n              context_data_position++;\n            }\n            value = 0;\n          }\n          value = context_w.charCodeAt(0);\n          for (i=0 ; i<16 ; i++) {\n            context_data_val = (context_data_val << 1) | (value&1);\n            if (context_data_position == bitsPerChar-1) {\n              context_data_position = 0;\n              context_data.push(getCharFromInt(context_data_val));\n              context_data_val = 0;\n            } else {\n              context_data_position++;\n            }\n            value = value >> 1;\n          }\n        }\n        context_enlargeIn--;\n        if (context_enlargeIn == 0) {\n          context_enlargeIn = Math.pow(2, context_numBits);\n          context_numBits++;\n        }\n        delete context_dictionaryToCreate[context_w];\n      } else {\n        value = context_dictionary[context_w];\n        for (i=0 ; i<context_numBits ; i++) {\n          context_data_val = (context_data_val << 1) | (value&1);\n          if (context_data_position == bitsPerChar-1) {\n            context_data_position = 0;\n            context_data.push(getCharFromInt(context_data_val));\n            context_data_val = 0;\n          } else {\n            context_data_position++;\n          }\n          value = value >> 1;\n        }\n\n\n      }\n      context_enlargeIn--;\n      if (context_enlargeIn == 0) {\n        context_enlargeIn = Math.pow(2, context_numBits);\n        context_numBits++;\n      }\n    }\n\n    // Mark the end of the stream\n    value = 2;\n    for (i=0 ; i<context_numBits ; i++) {\n      context_data_val = (context_data_val << 1) | (value&1);\n      if (context_data_position == bitsPerChar-1) {\n        context_data_position = 0;\n        context_data.push(getCharFromInt(context_data_val));\n        context_data_val = 0;\n      } else {\n        context_data_position++;\n      }\n      value = value >> 1;\n    }\n\n    // Flush the last char\n    while (true) {\n      context_data_val = (context_data_val << 1);\n      if (context_data_position == bitsPerChar-1) {\n        context_data.push(getCharFromInt(context_data_val));\n        break;\n      }\n      else context_data_position++;\n    }\n    return context_data.join(\'\');\n  },\n\n  decompress: function (compressed) {\n    if (compressed == null) return \"\";\n    if (compressed == \"\") return null;\n    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });\n  },\n\n  _decompress: function (length, resetValue, getNextValue) {\n    var dictionary = [],\n        next,\n        enlargeIn = 4,\n        dictSize = 4,\n        numBits = 3,\n        entry = \"\",\n        result = [],\n        i,\n        w,\n        bits, resb, maxpower, power,\n        c,\n        data = {val:getNextValue(0), position:resetValue, index:1};\n\n    for (i = 0; i < 3; i += 1) {\n      dictionary[i] = i;\n    }\n\n    bits = 0;\n    maxpower = Math.pow(2,2);\n    power=1;\n    while (power!=maxpower) {\n      resb = data.val & data.position;\n      data.position >>= 1;\n      if (data.position == 0) {\n        data.position = resetValue;\n        data.val = getNextValue(data.index++);\n      }\n      bits |= (resb>0 ? 1 : 0) * power;\n      power <<= 1;\n    }\n\n    switch (next = bits) {\n      case 0:\n          bits = 0;\n          maxpower = Math.pow(2,8);\n          power=1;\n          while (power!=maxpower) {\n            resb = data.val & data.position;\n            data.position >>= 1;\n            if (data.position == 0) {\n              data.position = resetValue;\n              data.val = getNextValue(data.index++);\n            }\n            bits |= (resb>0 ? 1 : 0) * power;\n            power <<= 1;\n          }\n        c = f(bits);\n        break;\n      case 1:\n          bits = 0;\n          maxpower = Math.pow(2,16);\n          power=1;\n          while (power!=maxpower) {\n            resb = data.val & data.position;\n            data.position >>= 1;\n            if (data.position == 0) {\n              data.position = resetValue;\n              data.val = getNextValue(data.index++);\n            }\n            bits |= (resb>0 ? 1 : 0) * power;\n            power <<= 1;\n          }\n        c = f(bits);\n        break;\n      case 2:\n        return \"\";\n    }\n    dictionary[3] = c;\n    w = c;\n    result.push(c);\n    while (true) {\n      if (data.index > length) {\n        return \"\";\n      }\n\n      bits = 0;\n      maxpower = Math.pow(2,numBits);\n      power=1;\n      while (power!=maxpower) {\n        resb = data.val & data.position;\n        data.position >>= 1;\n        if (data.position == 0) {\n          data.position = resetValue;\n          data.val = getNextValue(data.index++);\n        }\n        bits |= (resb>0 ? 1 : 0) * power;\n        power <<= 1;\n      }\n\n      switch (c = bits) {\n        case 0:\n          bits = 0;\n          maxpower = Math.pow(2,8);\n          power=1;\n          while (power!=maxpower) {\n            resb = data.val & data.position;\n            data.position >>= 1;\n            if (data.position == 0) {\n              data.position = resetValue;\n              data.val = getNextValue(data.index++);\n            }\n            bits |= (resb>0 ? 1 : 0) * power;\n            power <<= 1;\n          }\n\n          dictionary[dictSize++] = f(bits);\n          c = dictSize-1;\n          enlargeIn--;\n          break;\n        case 1:\n          bits = 0;\n          maxpower = Math.pow(2,16);\n          power=1;\n          while (power!=maxpower) {\n            resb = data.val & data.position;\n            data.position >>= 1;\n            if (data.position == 0) {\n              data.position = resetValue;\n              data.val = getNextValue(data.index++);\n            }\n            bits |= (resb>0 ? 1 : 0) * power;\n            power <<= 1;\n          }\n          dictionary[dictSize++] = f(bits);\n          c = dictSize-1;\n          enlargeIn--;\n          break;\n        case 2:\n          return result.join(\'\');\n      }\n\n      if (enlargeIn == 0) {\n        enlargeIn = Math.pow(2, numBits);\n        numBits++;\n      }\n\n      if (dictionary[c]) {\n        entry = dictionary[c];\n      } else {\n        if (c === dictSize) {\n          entry = w + w.charAt(0);\n        } else {\n          return null;\n        }\n      }\n      result.push(entry);\n\n      // Add w+entry[0] to the dictionary.\n      dictionary[dictSize++] = w + entry.charAt(0);\n      enlargeIn--;\n\n      w = entry;\n\n      if (enlargeIn == 0) {\n        enlargeIn = Math.pow(2, numBits);\n        numBits++;\n      }\n\n    }\n  }\n};\n  return LZString;\n})();\n\n//# sourceURL=smileycreations15://smilejs/modules/compress.js';
    moduleCache["core-main.js"] = 'try {\n    /*\n    BSD 3-Clause License\n\n    Copyright (c) 2019, smileycreations15 (me@smileycreations15.com)\n    All rights reserved.\n\n    Redistribution and use in source and binary forms, with or without\n    modification, are permitted provided that the following conditions are met:\n\n    1. Redistributions of source code must retain the above copyright notice, this\n       list of conditions and the following disclaimer.\n\n    2. Redistributions in binary form must reproduce the above copyright notice,\n       this list of conditions and the following disclaimer in the documentation\n       and/or other materials provided with the distribution.\n\n    3. Neither the name of the copyright holder nor the names of its\n       contributors may be used to endorse or promote products derived from\n       this software without specific prior written permission.\n\n    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\n    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\n    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\n    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\n    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\n    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n    */\n    var startDate = new Date()\n    this.smilejs = {}\n    if (this.document) loadModule(\"touchpolyfill.js\")\n    try {\n        smilejs.blockchain = loadModule(\"blockchain.js\")\n        smilejs.proofOfWork = loadModule(\"proof-of-work.js\")\n        loadModule(\"2-factor-auth.js\")\n        smilejs.shaSupported = true\n    } catch (e) {\n        smilejs.shaSupported = false\n    }\n    smilejs.Terminal = loadModule(\"terminal.js\")\n    smilejs.chess = loadModule(\"chess.js\")\n    smilejs.chess.Elo = loadModule(\"elo-ratings.js\")\n    smilejs.chess.engine = loadModule(\"engine.js\")\n    smilejs.ui = {}\n    smilejs.meta = {}\n    var data = loadModule(\"metadata.js\");\n    smilejs.meta.version = data.version\n    smilejs.meta.license = data.license\n\n    try {\n        smilejs.paper = loadModule(\"paper.js\")\n    } catch (e) {\n\n    }\n    smilejs.isDevtoolsOpen = loadModule(\"devtools.js\")\n    smilejs.compress = loadModule(\"compress.js\")\n    smilejs.loadCompressedLibrary = loadModule(\"load-compressed-lib.js\")\n    smilejs.ui.notify = function notify(location = \"top-left\", type = \"plain\", dialogContent, black = true) {\n        let dialog = document.createElement(\"div\")\n        dialog.className = \"smilejs-notify smilejs-\" + location + \" smilejs-do-show smilejs-font-notify\"\n        dialog.dataset.notificationStatus = type\n        dialog.innerHTML = dialogContent // positions : bottom-right, top-left, top-right, bar-bottom, bar-top, bottom-right, bottom-left\n        let blackText = [\"success\"\n\n\n\n            , \"notice\"\n\n\n\n            , \"error\"\n\n\n\n            , \"warning\"\n				] // notification types: success, notice, error, plain, warning, transparent\n\n        if (blackText.includes(type) && black !== false) {\n            dialog.style.color = \"black\"\n        }\n\n        document.body.appendChild(dialog)\n    }\n    // smilejs.ui.showLoaderOverlay = function showLoaderOverlay(id, text = null, overlayHtml = false) {\n    // 	if (null !== document.getElementById(id)) throw new Error(\"The element already exists.\");\n    // 	let div = document.createElement(\"div\")\n    // 	let option = \"center\"\n    //\n    // 	if (true === overlayHtml) {\n    // 		option = \"overlay\"\n    // 	}\n    //\n    // 	div.className = \"overlay\"\n    // 	div.id = id\n    // 	div.style.display = \"none\"\n    //\n    // 	if (null === text || undefined === text) {\n    // 		div.innerHTML = \'<div class=\"smilejs-text-\' + option + \'\"></div><div class=\"progress-slider\"><div class=\"line\"></div><div class=\"progress-subline inc\"></div><div class=\"progress-subline dec\"></div></div>\'\n    // 	} else {\n    // 		div.innerHTML = \'<div class=\"smilejs-text-overlay\">\' + text + \'</div><div class=\"progress-slider\"><div class=\"line\"></div><div class=\"progress-subline inc\"></div><div class=\"progress-subline dec\"></div></div>\'\n    // 	}\n    //\n    // 	document.body.appendChild(div)\n    // 	var proto = {\n    //\n    // 		\"element\": document.getElementById(id),\n    // 		\"show\": function () {\n    // 				if (null === document.getElementById(id)) throw new Error(\"The element could not be found, and may be removed from the DOM.\");\n    // 				document.getElementById(id)\n    // 					.style.display = \"block\"\n    // 			}\n    //\n    // 			,\n    // 		\"hide\": function () {\n    // 				if (null === document.getElementById(id)) throw new Error(\"The element could not be found, and may be removed from the DOM.\");\n    // 				document.getElementById(id)\n    // 					.style.display = \"none\"\n    // 			}\n    //\n    // 			,\n    // 		\"remove\": function () {\n    // 			if (null === document.getElementById(id)) throw new Error(\"The element could not be found, and may be removed from the DOM.\");\n    // 			document.body.removeChild(document.getElementById(id))\n    // 		}\n    // 	}\n    //\n    // 	// proto.remove = makeNative(proto.remove, \"function remove(){ [native code] }\")\n    // 	// proto.show = makeNative(proto.show, \"function show(){ [native code] }\")\n    // 	// proto.hide = makeNative(proto.hide, \"function hide(){ [native code] }\")\n    // 	proto[Symbol.toStringTag] = \"LoaderOverlay\"\n    // 	return Object.create(proto)\n    // }\n    smilejs.ui.trapFocus = function trapFocus(elem) {\n        var focusIndex = 0;\n        const focusable = \"a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not(*[tabindex=\'-1\']), *[contenteditable]\";\n        if (null !== document.querySelector(\":focus\")) document.querySelector(\":focus\")\n            .blur();\n        if (0 === elem.querySelectorAll(focusable)\n            .length) {\n            var element = document.createElement(\"focustrap\")\n            element.setAttribute(\"tabindex\", \"0\")\n            elem.appendChild(element)\n        }\n        elem.querySelectorAll(focusable)[0].focus();\n        elem.addEventListener(\"keydown\", function (evt) {\n            if (evt.which === 9) {\n                evt.preventDefault();\n                if (evt.shiftKey) {\n                    if (focusIndex !== 0) {\n                        focusIndex -= 1\n                        elem.querySelectorAll(focusable)[focusIndex].focus();\n                    } else {\n                        focusIndex = elem.querySelectorAll(focusable)\n                            .length - 1;\n                        elem.querySelectorAll(focusable)[focusIndex].focus();\n                    }\n                } else {\n                    if (focusIndex !== elem.querySelectorAll(focusable)\n                        .length - 1) {\n                        focusIndex += 1\n                        elem.querySelectorAll(focusable)[focusIndex].focus();\n                    } else {\n                        focusIndex = 0;\n                        elem.querySelectorAll(focusable)[focusIndex].focus();\n                    }\n                }\n            }\n        });\n    }\n    smilejs.randomId = function randomId(length, chars = \'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\') {\n        // var result = \'\';\n        // var characters = chars;\n        // var charactersLength = characters.length;\n        // for (var i = 0; i < length; i++) {\n        //     result += characters.charAt(Math.floor(Math.random() * charactersLength));\n        // }\n        var result = Array(length).join().split(\',\').map(function() { return chars.charAt(Math.floor(Math.random() * chars.length)); }).join(\'\');\n        return result;\n    }\n    smilejs.randomHex = function randomHex(length){\n      if (this.require){\n        var crypto1 = require(\"crypto\");\n        if (length % 2 !== 0) throw \"Should be a multiple of 2.\"\n        var id = crypto1.randomBytes(length / 2).toString(\'hex\');\n        return id\n      } else {\n        if (length % 2 !== 0) throw \"Should be a multiple of 2.\"\n        function getRandomId(length) {\n            if (!length) {\n                return \'\';\n            }\n            if (globalThis.crypto){\n              var arr = new Uint8Array(length / 2);\n              crypto.getRandomValues(arr)\n              return loadModule(\"utility.js\").buf2hex(arr.buffer)\n            } else {\n              return smilejs.randomId(length,\"abcdef0987654321\")\n            }\n        }\n        return getRandomId(length)\n      }\n    }\n    smilejs.domtoimage = loadModule(\"dom-to-image.js\")\n    smilejs.ui.modal = function (html) {\n        var div = document.createElement(\"div\")\n        div.className = \"smilejs-grey-overlay\"\n        var id = smilejs.randomId(30)\n        div.innerHTML = \'<div class=\"smilejs-modal\" id=\"\' + id + \'-modal\">\' + html + \'</div>\'\n        div.id = id\n        document.body.appendChild(div)\n        div = document.getElementById(id + \"-modal\")\n        smilejs.ui.trapFocus(div)\n        return {\n            \"element\": document.getElementById(id)\n            , \"modal\": document.getElementById(id + \"-modal\")\n        }\n    }\n    smilejs.indexedDB = loadModule(\"indexedDB.js\")\n    smilejs.meta.loadTime = new Date() - startDate\n\n} catch (e) {\n    console.error(new(loadModule(\"utility.js\")\n        .SmileJSError)(e, e.stack))\n}\nif (this.globalThis) {\n    smilejs.globalErrors = []\n    smilejs.globalErrors.onerror = () => {}\n    globalThis.onerror = function (msg, url, line, col, error) {\n        // Note that col & error are new to the HTML 5 spec and may not be\n        // supported in every browser.  It worked for me in Chrome.\n        var extra = `Message: ${msg}, url: ${url}, line: ${line}, col: ${col}, error: ${error}`\n        if (error) {\n            extra = error\n        }\n        smilejs.globalErrors.push(extra)\n        smilejs.globalErrors.onerror(extra)\n        return true;\n    }\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/core-main.js';
    moduleCache["css-loader.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\ndocument.head.innerHTML += `<style>\n${loadAsset(\"css.css\")}\n</style>`;\n// if (document.readyState === \"completed\"){\n// 	document.body.innerHTML = \"<paper>\" + document.body.innerHTML + \"</paper>\"\n// } else {\n// 	onload = ()=>{document.body.innerHTML = \"<paper>\" + document.body.innerHTML + \"</paper>\"}\n// }\n\n//# sourceURL=smileycreations15://smilejs/modules/css-loader.js';
    moduleCache["devtools.js"] = 'module.exports = function devToolsOpen(){\n	const threshold = 160;\n	var val = {open:false,vertical:false,horizontal:false}\n    if (globalThis.outerWidth - globalThis.innerWidth > threshold){\n		val.open = true\n		val.vertical = true\n	}\n	if (globalThis.outerHeight - globalThis.innerHeight > threshold){\n		val.open = true\n		val.horizontal = true\n	}\n	return val\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/devtools.js';
    moduleCache["dom-to-image.js"] = '(function (global) {\n    \'use strict\';\n    var cache = {}\n    var util = newUtil();\n    var inliner = newInliner();\n    var fontFaces = newFontFaces();\n    var images = newImages();\n\n    // Default impl options\n    var defaultOptions = {\n        // Default is to fail on error, no placeholder\n        imagePlaceholder: \"\",\n        // Default cache bust is false, it will use the cache\n        cacheBust: false\n    };\n\n    var domtoimage = {\n        toSvg: toSvg\n        , toPng: toPng\n        , toJpeg: toJpeg\n        , toBlob: toBlob\n        , toPixelData: toPixelData\n        , impl: {\n            fontFaces: fontFaces\n            , images: images\n            , util: util\n            , inliner: inliner\n            , options: {}\n        }\n    };\n\n    if (typeof module !== \'undefined\')\n        module.exports = domtoimage;\n    else\n        global.domtoimage = domtoimage;\n\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options\n     * @param {Function} options.filter - Should return true if passed node should be included in the output\n     *          (excluding node means excluding it\'s children as well). Not called on the root node.\n     * @param {String} options.bgcolor - color for the background, any valid CSS color value.\n     * @param {Number} options.width - width to be applied to node before rendering.\n     * @param {Number} options.height - height to be applied to node before rendering.\n     * @param {Object} options.style - an object whose properties to be copied to node\'s style before rendering.\n     * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),\n                defaults to 1.0.\n     * @param {String} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can\'t fetch\n     * @param {Boolean} options.cacheBust - set to true to cache bust by appending the time to the request url\n     * @return {Promise} - A promise that is fulfilled with a SVG image data URL\n     * */\n    function toSvg(node, options) {\n        options = options || {};\n        copyOptions(options);\n        return Promise.resolve(node)\n            .then(function (node) {\n                return cloneNode(node, options.filter || ((node1)=>{\n                  if (node1.tagName){\n                    return node1.tagName.toLowerCase() !== \"noscript\"\n\n                  }\n                  return true\n                }), true);\n            })\n            .then(embedFonts)\n            .then(inlineImages)\n            .then(applyOptions)\n            .then(function (clone) {\n                return makeSvgDataUri(clone\n                    , options.width || util.width(node)\n                    , options.height || util.height(node)\n                );\n            });\n\n        function applyOptions(clone) {\n            if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;\n\n            if (options.width) clone.style.width = options.width + \'px\';\n            if (options.height) clone.style.height = options.height + \'px\';\n\n            if (options.style)\n                Object.keys(options.style)\n                .forEach(function (property) {\n                    clone.style[property] = options.style[property];\n                });\n\n            return clone;\n        }\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.\n     * */\n    function toPixelData(node, options) {\n        return draw(node, options || {})\n            .then(function (canvas) {\n                return canvas.getContext(\'2d\')\n                    .getImageData(\n                        0\n                        , 0\n                        , util.width(node)\n                        , util.height(node)\n                    )\n                    .data;\n            });\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a PNG image data URL\n     * */\n    function toPng(node, options) {\n        return draw(node, options || {})\n            .then(function (canvas) {\n                return canvas.toDataURL();\n            });\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a JPEG image data URL\n     * */\n    function toJpeg(node, options) {\n        options = options || {};\n        return draw(node, options)\n            .then(function (canvas) {\n                return canvas.toDataURL(\'image/jpeg\', options.quality || 1.0);\n            });\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a PNG image blob\n     * */\n    function toBlob(node, options) {\n        return draw(node, options || {})\n            .then(util.canvasToBlob);\n    }\n\n    function copyOptions(options) {\n        // Copy options to impl options for use in impl\n        if (typeof (options.imagePlaceholder) === \'undefined\') {\n            domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;\n        } else {\n            domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;\n        }\n\n        if (typeof (options.cacheBust) === \'undefined\') {\n            domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;\n        } else {\n            domtoimage.impl.options.cacheBust = options.cacheBust;\n        }\n    }\n\n    function draw(domNode, options) {\n        return toSvg(domNode, options)\n            .then(e=>{\n                return \"data:image/svg+xml,\" + encodeURIComponent(e)\n            })\n            .then(util.makeImage)\n            .then(util.delay(100))\n            .then(function (image) {\n                var canvas = newCanvas(domNode);\n                canvas.getContext(\'2d\')\n                    .drawImage(image, 0, 0);\n                return canvas;\n            });\n\n        function newCanvas(domNode) {\n            var canvas = document.createElement(\'canvas\');\n            canvas.width = options.width || util.width(domNode);\n            canvas.height = options.height || util.height(domNode);\n\n            if (options.bgcolor) {\n                var ctx = canvas.getContext(\'2d\');\n                ctx.fillStyle = options.bgcolor;\n                ctx.fillRect(0, 0, canvas.width, canvas.height);\n            }\n\n            return canvas;\n        }\n    }\n\n    function cloneNode(node, filter, root) {\n        if (!root && filter && !filter(node)) return Promise.resolve();\n\n        return Promise.resolve(node)\n            .then(makeNodeCopy)\n            .then(function (clone) {\n                return cloneChildren(node, clone, filter);\n            })\n            .then(function (clone) {\n                return processClone(node, clone);\n            });\n\n        function makeNodeCopy(node) {\n            if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());\n            return node.cloneNode(false);\n        }\n\n        function cloneChildren(original, clone, filter) {\n            var children = original.childNodes;\n            if (children.length === 0) return Promise.resolve(clone);\n\n            return cloneChildrenInOrder(clone, util.asArray(children), filter)\n                .then(function () {\n                    return clone;\n                });\n\n            function cloneChildrenInOrder(parent, children, filter) {\n                var done = Promise.resolve();\n                children.forEach(function (child) {\n                    done = done\n                        .then(function () {\n                            return cloneNode(child, filter);\n                        })\n                        .then(function (childClone) {\n                            if (childClone) parent.appendChild(childClone);\n                        });\n                });\n                return done;\n            }\n        }\n\n        function processClone(original, clone) {\n            if (!(clone instanceof Element)) return clone;\n\n            return Promise.resolve()\n                .then(cloneStyle)\n                .then(clonePseudoElements)\n                .then(copyUserInput)\n                .then(fixSvg)\n                .then(function () {\n                    return clone;\n                });\n\n            function cloneStyle() {\n                copyStyle(globalThis.getComputedStyle(original), clone.style);\n\n                function copyStyle(source, target) {\n                    if (source.cssText) target.cssText = source.cssText;\n                    else copyProperties(source, target);\n\n                    function copyProperties(source, target) {\n                        util.asArray(source)\n                            .forEach(function (name) {\n                                target.setProperty(\n                                    name\n                                    , source.getPropertyValue(name)\n                                    , source.getPropertyPriority(name)\n                                );\n                            });\n                    }\n                }\n            }\n\n            function clonePseudoElements() {\n                [\':before\', \':after\'].forEach(function (element) {\n                    clonePseudoElement(element);\n                });\n\n                function clonePseudoElement(element) {\n                    var style = globalThis.getComputedStyle(original, element);\n                    var content = style.getPropertyValue(\'content\');\n\n                    if (content === \'\' || content === \'none\') return;\n\n                    var className = util.uid();\n                    clone.className = clone.className + \' \' + className;\n                    var styleElement = document.createElement(\'style\');\n                    styleElement.appendChild(formatPseudoElementStyle(className, element, style));\n                    clone.appendChild(styleElement);\n\n                    function formatPseudoElementStyle(className, element, style) {\n                        var selector = \'.\' + className + \':\' + element;\n                        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);\n                        return document.createTextNode(selector + \'{\' + cssText + \'}\');\n\n                        function formatCssText(style) {\n                            var content = style.getPropertyValue(\'content\');\n                            return style.cssText + \' content: \' + content + \';\';\n                        }\n\n                        function formatCssProperties(style) {\n\n                            return util.asArray(style)\n                                .map(formatProperty)\n                                .join(\'; \') + \';\';\n\n                            function formatProperty(name) {\n                                return name + \': \' +\n                                    style.getPropertyValue(name) +\n                                    (style.getPropertyPriority(name) ? \' !important\' : \'\');\n                            }\n                        }\n                    }\n                }\n            }\n\n            function copyUserInput() {\n                if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;\n                if (original instanceof HTMLInputElement) clone.setAttribute(\"value\", original.value);\n            }\n\n            function fixSvg() {\n                if (!(clone instanceof SVGElement)) return;\n                clone.setAttribute(\'xmlns\', \'http://www.w3.org/2000/svg\');\n\n                if (!(clone instanceof SVGRectElement)) return;\n                [\'width\', \'height\'].forEach(function (attribute) {\n                    var value = clone.getAttribute(attribute);\n                    if (!value) return;\n\n                    clone.style.setProperty(attribute, value);\n                });\n            }\n        }\n    }\n\n    function embedFonts(node) {\n        return fontFaces.resolveAll()\n            .then(function (cssText) {\n                var styleNode = document.createElement(\'style\');\n                node.appendChild(styleNode);\n                styleNode.appendChild(document.createTextNode(cssText));\n                return node;\n            });\n    }\n\n    function inlineImages(node) {\n        return images.inlineAll(node)\n            .then(function () {\n                return node;\n            });\n    }\n\n    function makeSvgDataUri(node, width, height) {\n        return Promise.resolve(node)\n            .then(function (node) {\n                node.setAttribute(\'xmlns\', \'http://www.w3.org/1999/xhtml\');\n                return new XMLSerializer()\n                    .serializeToString(node);\n            })\n            .then(util.escapeXhtml)\n            .then(function (xhtml) {\n                return \'<foreignObject x=\"0\" y=\"0\" width=\"100%\" height=\"100%\">\' + xhtml + \'</foreignObject>\';\n            })\n            .then(function (foreignObject) {\n                return \'<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"\' + width + \'\" height=\"\' + height + \'\">\' +\n                    foreignObject + \'</svg>\';\n            })\n            .then(function (svg) {\n                // return \'data:image/svg+xml;charset=utf-8,\' + svg;\n                return svg;\n            });\n    }\n\n    function newUtil() {\n        return {\n            escape: escape\n            , parseExtension: parseExtension\n            , mimeType: mimeType\n            , dataAsUrl: dataAsUrl\n            , isDataUrl: isDataUrl\n            , canvasToBlob: canvasToBlob\n            , resolveUrl: resolveUrl\n            , getAndEncode: getAndEncode\n            , uid: uid()\n            , delay: delay\n            , asArray: asArray\n            , escapeXhtml: escapeXhtml\n            , makeImage: makeImage\n            , width: width\n            , height: height\n        };\n\n        function mimes() {\n            /*\n             * Only WOFF and EOT mime types for fonts are \'real\'\n             * see http://www.iana.org/assignments/media-types/media-types.xhtml\n             */\n            var WOFF = \'application/font-woff\';\n            var JPEG = \'image/jpeg\';\n\n            return {\n                \'woff\': WOFF\n                , \'woff2\': WOFF\n                , \'ttf\': \'application/font-truetype\'\n                , \'eot\': \'application/vnd.ms-fontobject\'\n                , \'png\': \'image/png\'\n                , \'jpg\': JPEG\n                , \'jpeg\': JPEG\n                , \'gif\': \'image/gif\'\n                , \'tiff\': \'image/tiff\'\n                , \'svg\': \'image/svg+xml\'\n            };\n        }\n\n        function parseExtension(url) {\n            var match = /\\.([^\\.\\/]*?)$/g.exec(url);\n            if (match) return match[1];\n            else return \'\';\n        }\n\n        function mimeType(url) {\n            var extension = parseExtension(url)\n                .toLowerCase();\n            return mimes()[extension] || \'\';\n        }\n\n        function isDataUrl(url) {\n            return url.search(/^(data:)/) !== -1;\n        }\n\n        function toBlob(canvas) {\n            return new Promise(function (resolve) {\n                var binaryString = globalThis.atob(canvas.toDataURL()\n                    .split(\',\')[1]);\n                var length = binaryString.length;\n                var binaryArray = new Uint8Array(length);\n\n                for (var i = 0; i < length; i++)\n                    binaryArray[i] = binaryString.charCodeAt(i);\n\n                resolve(new Blob([binaryArray], {\n                    type: \'image/png\'\n                }));\n            });\n        }\n\n        function canvasToBlob(canvas) {\n            if (canvas.toBlob)\n                return new Promise(function (resolve) {\n                    canvas.toBlob(resolve);\n                });\n\n            return toBlob(canvas);\n        }\n\n        function resolveUrl(url, baseUrl) {\n            var doc = document.implementation.createHTMLDocument();\n            var base = doc.createElement(\'base\');\n            doc.head.appendChild(base);\n            var a = doc.createElement(\'a\');\n            doc.body.appendChild(a);\n            base.href = baseUrl;\n            a.href = url;\n            return a.href;\n        }\n\n        function uid() {\n            var index = 0;\n\n            return function () {\n                return \'u\' + fourRandomChars() + index++;\n\n                function fourRandomChars() {\n                    /* see http://stackoverflow.com/a/6248722/2519373 */\n                    return (\'0000\' + (Math.random() * Math.pow(36, 4) << 0)\n                            .toString(36))\n                        .slice(-4);\n                }\n            };\n        }\n\n        function makeImage(uri) {\n            return new Promise(function (resolve, reject) {\n                var image = new Image();\n                image.onload = function () {\n                    resolve(image);\n                };\n                image.onerror = reject;\n                image.src = uri;\n            });\n        }\n\n        function getAndEncode(url) {\n            var TIMEOUT = 30000;\n            if (domtoimage.impl.options.cacheBust) {\n                // Cache bypass so we dont have CORS issues with cached images\n                // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache\n                url += ((/\\?/)\n                        .test(url) ? \"&\" : \"?\") + (new Date())\n                    .getTime();\n                cache = {}\n            }\n\n            return new Promise(function (resolve) {\n                if (cache[url]){resolve(cache[url]);return}\n                var request = new XMLHttpRequest();\n                request.crossorigin = true;\n                request.withCredentials = false;\n                request.crossOrigin = true;\n\n                request.onreadystatechange = done;\n                request.ontimeout = timeout;\n                request.responseType = \'blob\';\n                request.timeout = TIMEOUT;\n                request.open(\'GET\', url, true);\n                try {\n                  request.send();\n\n                } catch (e) {\n\n                } finally {\n\n                }\n                var placeholder;\n                if (domtoimage.impl.options.imagePlaceholder) {\n                    var split = domtoimage.impl.options.imagePlaceholder.split(/,/);\n                    if (split && split[1]) {\n                        placeholder = split[1];\n                    }\n                }\n\n                function done() {\n                    if (request.readyState !== 4) return;\n\n                    if (request.status !== 200) {\n                        if (placeholder) {\n                            resolve(placeholder);\n                        } else {\n                            fail(\'cannot fetch resource: \' + url + \', status: \' + request.status);\n                        }\n\n                        return;\n                    }\n\n                    var encoder = new FileReader();\n                    encoder.onloadend = function () {\n                        var content = encoder.result.split(/,/)[1];\n                        cache[url] = content\n                        resolve(content);\n                    };\n                    encoder.readAsDataURL(request.response);\n                }\n\n                function timeout() {\n                    if (placeholder) {\n                        resolve(placeholder);\n                    } else {\n                        fail(\'timeout of \' + TIMEOUT + \'ms occured while fetching resource: \' + url);\n                    }\n                }\n\n                function fail(message) {\n                    console.error(message);\n                    if (placeholder){\n                        resolve(placeholder);\n                    } else {\n                        resolve(\'\');\n                    }\n                }\n            });\n        }\n\n        function dataAsUrl(content, type) {\n            return \'data:\' + type + \';base64,\' + content;\n        }\n\n        function escape(string) {\n            return string.replace(/([.*+?^${}()|\\[\\]\\/\\\\])/g, \'\\\\$1\');\n        }\n\n        function delay(ms) {\n            return function (arg) {\n                return new Promise(function (resolve) {\n                    setTimeout(function () {\n                        resolve(arg);\n                    }, ms);\n                });\n            };\n        }\n\n        function asArray(arrayLike) {\n            var array = [];\n            var length = arrayLike.length;\n            for (var i = 0; i < length; i++) array.push(arrayLike[i]);\n            return array;\n        }\n\n        function escapeXhtml(string) {\n          return string\n            // return string.replace(/#/g, \'%23\')\n            //     .replace(/\\n/g, \'%0A\');\n        }\n\n        function width(node) {\n            var leftBorder = px(node, \'border-left-width\');\n            var rightBorder = px(node, \'border-right-width\');\n            return node.scrollWidth + leftBorder + rightBorder;\n        }\n\n        function height(node) {\n            var topBorder = px(node, \'border-top-width\');\n            var bottomBorder = px(node, \'border-bottom-width\');\n            return node.scrollHeight + topBorder + bottomBorder;\n        }\n\n        function px(node, styleProperty) {\n            var value = globalThis.getComputedStyle(node)\n                .getPropertyValue(styleProperty);\n            return parseFloat(value.replace(\'px\', \'\'));\n        }\n    }\n\n    function newInliner() {\n        var URL_REGEX = /url\\([\'\"]?([^\'\"]+?)[\'\"]?\\)/g;\n\n        return {\n            inlineAll: inlineAll\n            , shouldProcess: shouldProcess\n            , impl: {\n                readUrls: readUrls\n                , inline: inline\n            }\n        };\n\n        function shouldProcess(string) {\n            return string.search(URL_REGEX) !== -1;\n        }\n\n        function readUrls(string) {\n            var result = [];\n            var match;\n            while ((match = URL_REGEX.exec(string)) !== null) {\n                result.push(match[1]);\n            }\n            return result.filter(function (url) {\n                return !util.isDataUrl(url);\n            });\n        }\n\n        function inline(string, url, baseUrl, get) {\n            return Promise.resolve(url)\n                .then(function (url) {\n                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;\n                })\n                .then(get || util.getAndEncode)\n                .then(function (data) {\n                    return util.dataAsUrl(data, util.mimeType(url));\n                })\n                .then(function (dataUrl) {\n                    return string.replace(urlAsRegex(url), \'$1\' + dataUrl + \'$3\');\n                });\n\n            function urlAsRegex(url) {\n                return new RegExp(\'(url\\\\([\\\'\"]?)(\' + util.escape(url) + \')([\\\'\"]?\\\\))\', \'g\');\n            }\n        }\n\n        function inlineAll(string, baseUrl, get) {\n            if (nothingToInline()) return Promise.resolve(string);\n\n            return Promise.resolve(string)\n                .then(readUrls)\n                .then(function (urls) {\n                    var done = Promise.resolve(string);\n                    urls.forEach(function (url) {\n                        done = done.then(function (string) {\n                            return inline(string, url, baseUrl, get);\n                        });\n                    });\n                    return done;\n                });\n\n            function nothingToInline() {\n                return !shouldProcess(string);\n            }\n        }\n    }\n\n    function newFontFaces() {\n        return {\n            resolveAll: resolveAll\n            , impl: {\n                readAll: readAll\n            }\n        };\n\n        function resolveAll() {\n            return readAll(document)\n                .then(function (webFonts) {\n                    return Promise.all(\n                        webFonts.map(function (webFont) {\n                            return webFont.resolve();\n                        })\n                    );\n                })\n                .then(function (cssStrings) {\n                    return cssStrings.join(\'\\n\');\n                });\n        }\n\n        function readAll() {\n            return Promise.resolve(util.asArray(document.styleSheets))\n                .then(getCssRules)\n                .then(selectWebFontRules)\n                .then(function (rules) {\n                    return rules.map(newWebFont);\n                });\n\n            function selectWebFontRules(cssRules) {\n                return cssRules\n                    .filter(function (rule) {\n                        return rule.type === CSSRule.FONT_FACE_RULE;\n                    })\n                    .filter(function (rule) {\n                        return inliner.shouldProcess(rule.style.getPropertyValue(\'src\'));\n                    });\n            }\n\n            function getCssRules(styleSheets) {\n                var cssRules = [];\n                styleSheets.forEach(function (sheet) {\n                    try {\n                        util.asArray(sheet.cssRules || [])\n                            .forEach(cssRules.push.bind(cssRules));\n                    } catch (e) {\n                        console.log(\'Error while reading CSS rules from \' + sheet.href, e.toString());\n                    }\n                });\n                return cssRules;\n            }\n\n            function newWebFont(webFontRule) {\n                return {\n                    resolve: function resolve() {\n                        var baseUrl = (webFontRule.parentStyleSheet || {})\n                            .href;\n                        return inliner.inlineAll(webFontRule.cssText, baseUrl);\n                    }\n                    , src: function () {\n                        return webFontRule.style.getPropertyValue(\'src\');\n                    }\n                };\n            }\n        }\n    }\n\n    function newImages() {\n        return {\n            inlineAll: inlineAll\n            , impl: {\n                newImage: newImage\n            }\n        };\n\n        function newImage(element) {\n            return {\n                inline: inline\n            };\n\n            function inline(get) {\n                if (util.isDataUrl(element.src)) return Promise.resolve();\n\n                return Promise.resolve(element.src)\n                    .then(get || util.getAndEncode)\n                    .then(function (data) {\n                        return util.dataAsUrl(data, util.mimeType(element.src));\n                    })\n                    .then(function (dataUrl) {\n                        return new Promise(function (resolve, reject) {\n                            element.onload = resolve;\n                            element.onerror = reject;\n                            element.src = dataUrl;\n                        });\n                    });\n            }\n        }\n\n        function inlineAll(node) {\n            if (!(node instanceof Element)) return Promise.resolve(node);\n\n            return inlineBackground(node)\n                .then(function () {\n                    if (node instanceof HTMLImageElement)\n                        return newImage(node)\n                            .inline();\n                    else\n                        return Promise.all(\n                            util.asArray(node.childNodes)\n                            .map(function (child) {\n                                return inlineAll(child);\n                            })\n                        );\n                });\n\n            function inlineBackground(node) {\n                var background = node.style.getPropertyValue(\'background\');\n\n                if (!background) return Promise.resolve(node);\n\n                return inliner.inlineAll(background)\n                    .then(function (inlined) {\n                        node.style.setProperty(\n                            \'background\'\n                            , inlined\n                            , node.style.getPropertyPriority(\'background\')\n                        );\n                    })\n                    .then(function () {\n                        return node;\n                    });\n            }\n        }\n    }\n})(this);\n\n//# sourceURL=smileycreations15://smilejs/modules/dom-to-image.js';
    moduleCache["elo-ratings.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nmodule.exports = class Elo {\n  constructor(){\n    this.wins = 0\n    this.loses = 0\n    this.draws = 0\n    this.opponentRatingsTotal = 0;\n  }\n  get rating(){\n    if ((this.wins + this.loses + this.draws) === 0) return 0;\n    return ((this.opponentRatingsTotal + (400 * (this.wins - this.loses)))) / (this.wins + this.loses + this.draws)\n  }\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/elo-ratings.js';
    moduleCache["engine.js"] = 'var game = loadModule(\"chess.js\")()\nvar positionCount, i = 0;\nvar evaluateBoard = function(board, color) {\n  // Sets the value for each piece using standard piece value\n  var pieceValue = {\n    \'p\': 100,\n    \'n\': 350,\n    \'b\': 350,\n    \'r\': 525,\n    \'q\': 1000,\n    \'k\': 10000\n  };\n\n  // Loop through all pieces on the board and sum up total\n  var value = 0;\n  board.forEach(function(row) {\n    row.forEach(function(piece) {\n      if (piece) {\n        // Subtract piece value if it is opponent\'s piece\n        value += pieceValue[piece[\'type\']]\n                 * (piece[\'color\'] === color ? 1 : -1);\n      }\n    });\n  });\n\n  return value;\n};\nvar calcBestMove = function(depth, game, playerColor,\n                            alpha=Number.NEGATIVE_INFINITY,\n                            beta=Number.POSITIVE_INFINITY,\n                            isMaximizingPlayer=true) {\n  // Base case: evaluate board\n  if (depth === 0) {\n    value = evaluateBoard(game.board(), playerColor);\n    return [value, null]\n  }\n\n  // Recursive case: search possible moves\n  var bestMove = null; // best move not set yet\n  var possibleMoves = game.moves();\n  // Set random order for possible moves\n  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});\n  // Set a default best move value\n  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY\n                                         : Number.POSITIVE_INFINITY;\n  // Search through all possible moves\n  for (var i = 0; i < possibleMoves.length; i++) {\n    var move = possibleMoves[i];\n    // Make the move, but undo before exiting loop\n    game.move(move);\n    // Recursively get the value from this move\n    value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];\n    // Log the value of this move\n    // console.log(isMaximizingPlayer ? \'Max: \' : \'Min: \', depth, move, value,\n    //            bestMove, bestMoveValue);\n\n    if (isMaximizingPlayer) {\n      // Look for moves that maximize position\n      if (value > bestMoveValue) {\n        bestMoveValue = value;\n        bestMove = move;\n      }\n      alpha = Math.max(alpha, value);\n    } else {\n      // Look for moves that minimize position\n      if (value < bestMoveValue) {\n        bestMoveValue = value;\n        bestMove = move;\n      }\n      beta = Math.min(beta, value);\n    }\n    // Undo previous move\n    game.undo();\n    // Check for alpha beta pruning\n    if (beta <= alpha) {\n      // console.log(\'Prune\', alpha, beta);\n      break;\n    }\n  }\n  // Log the best move at the current depth\n  // console.log(\'Depth: \' + depth + \' | Best Move: \' + bestMove + \' | \' + bestMoveValue + \' | A: \' + alpha + \' | B: \' + beta);\n  // Return the best move, or the only move\n  return [bestMoveValue, bestMove || possibleMoves[0]];\n}\n\nvar generateBestMove = function (depth, move = false) {\n    if (game.game_over()){\n      throw new Error(\"Game over.\")\n    }\n    var bestMove = calcBestMove(depth,game,game.turn())[1];\n    if (move) game.move(bestMove);\n    return bestMove\n};\nvar updateBoard = function (fen){\n  game.load(fen)\n}\nvar updateBoardPGN = function (fen){\n  game.load_pgn(fen)\n}\nvar move = (data)=>{\n  game.move(data)\n}\nvar getBoard = ()=>{return game}\nmodule.exports = {\n  getBoard,\n  generateBestMove,\n  updateBoard,\n  updateBoardPGN,\n  move\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/engine.js';
    moduleCache["fen.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nconst matchFullFEN = /^\\s*([prnbqkPRNBQK12345678]{1,8}(?:\\/[prnbqkPRNBQK12345678]{1,8}){7})\\s+(w|b)\\s+([KQkqA-Ha-h]{1,4}|\\-)\\s+(?:(?:([a-h][36]|\\-)\\s+(\\d{1,3})\\s+(\\d{1,4}))|(?:0\\s+0))\\s*$/;\nconst fenExpand = /[1-8]+/g;\nconst fenPack = /\\-+/g;\nconst fenSubst = { 1: \'-\', 2: \'--\', 3: \'---\', 4: \'----\', 5: \'-----\', 6: \'------\', 7: \'-------\', 8: \'--------\' };\n/**\n * Class FenParser - see readme for more information\n */\nmodule.exports = class FenParser {\n    /**\n     * @constructor {FenParser}\n     * @param {string} value a chess FEN string\n     * @description Constructs a parsed FEN, check isValid property for success\n     */\n    constructor(value) {\n        /** The original string the object was constructed from */\n        this.original = \'\';\n        /** true if the FEN provided to the constructor was validated and represented the full 8x8 board. */\n        this.isValid = false;\n        /** Gets the encoded version of the ranks, use the ranks property to modify. */\n        this.positions = \'\';\n        /** Gets or sets the unencoded rank & file position of pieces using a dash `\'-\'` for an empty square. */\n        this.ranks = [];\n        /** Gets or sets the color of the player who should make the next move. */\n        this.turn = \'\';\n        /** Gets or sets the valid sides (`kqKQ`) or files (`abcdefghABCDEFGH`) valid for castling. */\n        this.castles = \'\';\n        /** Gets or sets the currently possible en passant square in file+rank notation, or `-` for none. */\n        this.enpass = \'\';\n        /** Gets or sets the number of halfmoves since the last capture or pawn advance. */\n        this.halfmoveClock = 0;\n        /** Gets or sets the number of the full move. It starts at 1, and is incremented after Black\'s move. */\n        this.moveNumber = 0;\n        this.original = (typeof value === \'string\') ? value : \'\';\n        const match = this.original.match(matchFullFEN);\n        this.isValid = !!match;\n        if (match) {\n            this.positions = match[1];\n            this.ranks = match[1].split(\'/\').map(s => s.replace(fenExpand, i => fenSubst[i]));\n            this.turn = match[2];\n            this.castles = match[3];\n            this.enpass = match[4] !== undefined ? match[4] : \'-\';\n            this.halfmoveClock = match[5] !== undefined ? parseInt(match[5], 10) : 0;\n            this.moveNumber = match[6] !== undefined ? parseInt(match[6], 10) : 1;\n            this.isValid = this.ranks.reduce((before, rank) => before && rank.length === 8, true);\n        }\n    }\n    /**\n     * Returns the properties of this as a FEN (does not valid).\n     * @returns {string} The reconstructed FEN string\n     */\n    toString() {\n        const positions = this.ranks.map(rank => rank.replace(fenPack, m => m.length.toString())).join(\'/\');\n        return `${positions} ${this.turn} ${this.castles} ${this.enpass} ${this.halfmoveClock} ${this.moveNumber}`;\n    }\n    /**\n     * Checks to see if a piece exists in the FEN string.\n     * @param {string} piece Any valid chess piece \'prnbqk\' for black or upper-case for white.\n     * @returns {boolean} true if found, otherwise false.\n     */\n    hasPiece(piece) {\n        return this.positions.indexOf(piece) >= 0;\n    }\n    /**\n     * Returns a map of each piece type encountered to the count of occurrences\n     * @returns {{string: number}} an object map for {[piece]: count}\n     */\n    counts() {\n        const counts = {};\n        for (const rank of this.ranks) {\n            for (const ch of rank) {\n                if (ch !== \'-\') {\n                    counts[ch] = (counts[ch] || 0) + 1;\n                }\n            }\n        }\n        return counts;\n    }\n}\n/**\n * @static\n * @param {string} text\n * @returns {boolean} true if valid.\n * @description Returns true if the provided argument \'appears\' to be a valid chess FEN\n */\nmodule.exports.isFen = (text) => (typeof text === \'string\' && matchFullFEN.test(text));\n\n//# sourceURL=smileycreations15://smilejs/modules/fen.js';
    moduleCache["indexedDB.js"] = '(function () {\n  var store;\n  var Store = class Store {\n    constructor(dbName = \'smilejs-store\', storeName = \'main\') {\n      this.storeName = storeName;\n      this._dbp = new Promise((resolve, reject) => {\n        const openreq = indexedDB.open(dbName, 1);\n        openreq.onerror = () => reject(openreq.error);\n        openreq.onsuccess = () => resolve(openreq.result);\n        // First time setup: create an empty object store\n        openreq.onupgradeneeded = () => {\n          openreq.result.createObjectStore(storeName);\n        };\n      });\n    }\n    _withIDBStore(type, callback) {\n      return this._dbp.then(db => new Promise((resolve, reject) => {\n        const transaction = db.transaction(this.storeName, type);\n        transaction.oncomplete = () => resolve();\n        transaction.onabort = transaction.onerror = () => reject(transaction.error);\n        callback(transaction.objectStore(this.storeName));\n      }));\n    }\n  }\n  let getDefaultStore = function getDefaultStore() {\n    if (!store)\n      store = new Store();\n    return store;\n  }\n\n  let get = function get(key, store = getDefaultStore()) {\n    let req;\n    return store._withIDBStore(\'readonly\', store => {\n        req = store.get(key);\n      })\n      .then(() => req.result);\n  }\n\n  let set = function set(key, value, store = getDefaultStore()) {\n    return store._withIDBStore(\'readwrite\', store => {\n      store.put(value, key);\n    });\n  }\n\n  let del = function del(key, store = getDefaultStore()) {\n    return store._withIDBStore(\'readwrite\', store => {\n      store.delete(key);\n    });\n  }\n\n  let clear = function clear(store = getDefaultStore()) {\n    return store._withIDBStore(\'readwrite\', store => {\n      store.clear();\n    });\n  }\n\n  let keys = function keys(store = getDefaultStore()) {\n    const keys = [];\n    return store._withIDBStore(\'readonly\', store => {\n        // This would be store.getAllKeys(), but it isn\'t supported by Edge or Safari.\n        // And openKeyCursor isn\'t supported by Safari.\n        (store.openKeyCursor || store.openCursor)\n        .call(store)\n          .onsuccess = function () {\n            if (!this.result)\n              return;\n            keys.push(this.result.key);\n            this.result.continue();\n          };\n      })\n      .then(() => keys);\n  }\n  var obj123 = {\n    \"Store\": Store,\n    \"get\": get,\n    \"set\": set,\n    \"del\": del,\n    \"clear\": clear,\n    \"keys\": keys\n  }\n  module.exports = obj123\n})()\n\n//# sourceURL=smileycreations15://smilejs/modules/indexedDB.js';
    moduleCache["load-compressed-lib.js"] = 'function fetchArrayBuffer(url, callback) {\n	var xhr = new XMLHttpRequest();\n	xhr.open(\'get\', url);\n	xhr.responseType = \'arraybuffer\';\n	xhr.onload = function() {\n		callback(xhr.response);\n	};\n	xhr.send();\n}\nmodule.exports = (url)=>{\n	fetchArrayBuffer(url,(e)=>{\n		eval(loadModule(\"compress.js\").decompressFromUint8Array(new Uint8Array(e)))\n	})\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/load-compressed-lib.js';
    moduleCache["metadata.js"] = 'module.exports = {\n  \"version\":\"v1.0.5-alpha\",\n  \"author\":\"smileycreations15\",\n  \"license\":\"BSD 3-Clause\",\n  \"tokens\":[\n    \"41773fd3a52c484de69b8c45d676c1a35438389714adfa6a015b4431b8626dfa231a76f8106425dc2fe1cb466c478607352454dcc08eb3867fec932679ce4a9c41773fd3a52c484de69b8c45d676c1a35438389714adfa6a015b4431b8626dfa231a76f8106425dc2fe1cb466c478607352454dcc08eb3867fec932679ce4a9c\"\n  ],\n  \"releases\":[\n    \"v1.2.1-beta\"\n  ]\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/metadata.js';
    moduleCache["paper-ripple.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nif (this.globalThis){\n  let current;\n  function is_touch_device() {\n    var prefixes = \' -webkit- -moz- -o- -ms- \'.split(\' \');\n    var mq = function(query) {\n      return globalThis.matchMedia(query).matches;\n    }\n\n    if ((\'ontouchstart\' in globalThis) || globalThis.DocumentTouch && document instanceof DocumentTouch) {\n      return true;\n    }\n\n    // include the \'heartz\' as a way to have a non matching MQ to help terminate the join\n    // https://git.io/vznFH\n    var query = [\'(\', prefixes.join(\'touch-enabled),(\'), \'heartz\', \')\'].join(\'\');\n    return mq(query);\n  }\n\n  is_touch_device()?document.addEventListener(\"touchstart\",(event)=>{\n          if (current) {\n          const remove = current;\n          current = null;\n          setTimeout(function () {\n              if (remove.parentNode) remove.parentNode.removeChild(remove);\n          }, 800);\n      }\n\n      let target = event.target;\n      while (target && target.classList && !target.classList.contains(\"smilejs-ripple\")) target = target.parentNode;\n      if (!target || !target.classList || !target.classList.contains(\"smilejs-ripple\")) return;\n      if (event.targetTouches.length > 1) return;\n      const x = event.targetTouches[0].clientX - target.getBoundingClientRect().left;\n      const y = event.targetTouches[0].clientY - target.getBoundingClientRect().top;\n      const maxW = Math.max(x, target.offsetWidth - x);\n      const maxH = Math.max(y, target.offsetHeight - y);\n      const size = Math.sqrt(maxW * maxW + maxH * maxH);\n\n      const parent = document.createElement(\"paper-ripple\");\n      target.appendChild(parent);\n\n      const effect = document.createElement(\"paper-ripple-inner\");\n      effect.style.top = (y - size) + \"px\";\n      effect.style.left = (x - size) + \"px\";\n      effect.style.height = size * 2 + \"px\";\n      effect.style.width = size * 2 + \"px\";\n      effect.style.background = target.getAttribute(\"ripple-color\") || globalThis.smilejs.paper.rippleColor;\n      parent.appendChild(effect);\n\n      current = parent;\n\n      const timeout = setTimeout(function () {\n          effect.style.transform = \"scale(1)\";\n      }, 16);\n\n      document.ontouchend = document.ontouchcancel = function () {\n          document.ontouchend  = document.ontouchmove = null;\n          current.firstChild.style.opacity = \"0\";\n      };\n\n      document.ontouchmove = function (move) {\n          if (event.targetTouches[0].clientX - move.targetTouches[0].clientX > 4 || event.targetTouches[0].clientX - move.targetTouches[0].clientX < -4 || event.targetTouches[0].clientX - move.targetTouches[0].clientY > 4 || event.targetTouches[0].clientY - move.targetTouches[0].clientY < -4) {\n              clearTimeout(timeout);\n              document.ontouchcancel()\n          }\n      };\n  }):document.addEventListener(\"mousedown\",function (event) {\n      if (current) {\n          const remove = current;\n          current = null;\n          setTimeout(function () {\n              if (remove.parentNode) remove.parentNode.removeChild(remove);\n          }, 800);\n      }\n\n      let target = event.target;\n      while (target && target.classList && !target.classList.contains(\"smilejs-ripple\")) target = target.parentNode;\n      if (!target || !target.classList || !target.classList.contains(\"smilejs-ripple\")) return;\n\n      const x = event.clientX - target.getBoundingClientRect().left;\n      const y = event.clientY - target.getBoundingClientRect().top;\n      const maxW = Math.max(x, target.offsetWidth - x);\n      const maxH = Math.max(y, target.offsetHeight - y);\n      const size = Math.sqrt(maxW * maxW + maxH * maxH);\n\n      const parent = document.createElement(\"paper-ripple\");\n      target.appendChild(parent);\n\n      const effect = document.createElement(\"paper-ripple-inner\");\n      effect.style.top = (y - size) + \"px\";\n      effect.style.left = (x - size) + \"px\";\n      effect.style.height = size * 2 + \"px\";\n      effect.style.width = size * 2 + \"px\";\n      effect.style.background = target.getAttribute(\"ripple-color\") || globalThis.smilejs.paper.rippleColor;\n      parent.appendChild(effect);\n\n      current = parent;\n\n      const timeout = setTimeout(function () {\n          effect.style.transform = \"scale(1)\";\n      }, 16);\n\n      document.onpointerup = document.onpointercancel = document.onmouseup = function () {\n          document.onpointerup = document.onpointercancel = document.onpointermove = document.onmousemove = document.onmouseup = null;\n          current.firstChild.style.opacity = \"0\";\n      };\n\n      document.onpointermove = function (move) {\n          if (event.clientX - move.x > 4 || event.clientX - move.x < -4 || event.clientY - move.y > 4 || event.clientY - move.y < -4) {\n              clearTimeout(timeout);\n              document.onpointercancel();\n          }\n      };\n      document.onmousemove = function (move) {\n          if (event.clientX - move.x > 4 || event.clientX - move.x < -4 || event.clientY - move.y > 4 || event.clientY - move.y < -4) {\n              clearTimeout(timeout);\n              document.onpointercancel();\n          }\n      };\n  });\n  document.ontouchstart = null;\n  document.ontouchend = null;\n  document.ontouchmove = null;\n  document.ontouchcancel = null;\n  globalThis.ontouchstart = null;\n  globalThis.ontouchend = null;\n  globalThis.ontouchmove = null;\n  globalThis.ontouchcancel = null;\n\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/paper-ripple.js';
    moduleCache["paper.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nmodule.exports.rippleColor = \"rgba(255, 255, 255, 0.6)\";\nif (this.document) loadModule(\"paper-ripple.js\");\nmodule.exports.initRipple = ()=>{};\n// module.exports.initRipple1 = ()=>{loadModule(\"paper-ripple-1.js\")}\nif (this.document) loadModule(\"css-loader.js\");\nif (this.document) loadModule(\"radio.js\");\n\n//# sourceURL=smileycreations15://smilejs/modules/paper.js';
    moduleCache["proof-of-work.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nvar { md5 } = loadModule(\"module.js\")\nvar sha = loadModule(\"sha.js\")\nmodule.exports.solve = function solve(data,difficulty) {\n  var nonce = 0n;\n  var hash = \" \";\n  var date = \" \";\n  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join(\"0\")){\n    nonce++\n    date = Number(new Date())\n    date = String(date)\n    // date = date.match(/.{1,1}/g)\n    // date.splice(date.length - 3,2)\n    // date = date.join(\"\")\n    hash = sha.sha512(String(difficulty) + String(nonce) + data)\n  }\n  return hash + \"x\" + nonce + \"x\" + difficulty\n}\nmodule.exports.verify = function verify(data,hash) {\n  var hashParts = hash.split(\"x\")\n  var hash = hashParts[0]\n  var nonce = Number(hashParts[1])\n  var difficulty = Number(hashParts[2])\n  var nulls = \"\"\n  for (var i = 0;i !== Math.abs(difficulty);i++) nulls += \"0\"\n  if (sha.sha512(String(difficulty) + String(nonce) + data) === hash && hash.startsWith(nulls)){\n    return true\n  } else {\n    return false\n  }\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/proof-of-work.js';
    moduleCache["radio.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\ndocument.addEventListener(\"click\",event=>{\n  let target = event.target;\n  while (target && target.classList && !target.classList.contains(\"radio\")) target = target.parentNode;\n  if (!target || !target.classList || !target.classList.contains(\"radio\")) return;\n  var e = new Event(\"radiostatechange\")\n  target.dispatchEvent(e)\n  if (e.defaultPrevented) return;\n  if (target.hasAttribute(\"checked\")){\n    target.removeAttribute(\"checked\")\n  } else {\n    target.setAttribute(\"checked\",\"\")\n  }\n})\n\n//# sourceURL=smileycreations15://smilejs/modules/radio.js';
    moduleCache["sha.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nmodule.exports.sha512 = function SHA512(str) {\n function int64(msint_32, lsint_32) {\n this.highOrder = msint_32;\n this.lowOrder = lsint_32;\n }\n\n var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),\n new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),\n new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),\n new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];\n\n var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),\n new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),\n new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),\n new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),\n new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),\n new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),\n new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),\n new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),\n new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),\n new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),\n new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),\n new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),\n new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),\n new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),\n new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),\n new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),\n new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),\n new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),\n new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),\n new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),\n new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),\n new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),\n new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),\n new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),\n new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),\n new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),\n new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),\n new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),\n new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),\n new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),\n new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),\n new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),\n new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),\n new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),\n new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),\n new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),\n new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),\n new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),\n new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),\n new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];\n\n var W = new Array(64);\n var a, b, c, d, e, f, g, h, i, j;\n var T1, T2;\n var charsize = 8;\n\n function utf8_encode(str) {\n return unescape(encodeURIComponent(str));\n }\n\n function str2binb(str) {\n var bin = [];\n var mask = (1 << charsize) - 1;\n var len = str.length * charsize;\n\n for (var i = 0; i < len; i += charsize) {\n bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));\n }\n\n return bin;\n }\n\n function binb2hex(binarray) {\n var hex_tab = \'0123456789abcdef\';\n var str = \'\';\n var length = binarray.length * 4;\n var srcByte;\n\n for (var i = 0; i < length; i += 1) {\n srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);\n str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);\n }\n\n return str;\n }\n\n function safe_add_2(x, y) {\n var lsw, msw, lowOrder, highOrder;\n\n lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);\n msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);\n lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);\n msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);\n highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n return new int64(highOrder, lowOrder);\n }\n\n function safe_add_4(a, b, c, d) {\n var lsw, msw, lowOrder, highOrder;\n\n lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);\n msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);\n lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);\n msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);\n highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n return new int64(highOrder, lowOrder);\n }\n\n function safe_add_5(a, b, c, d, e) {\n var lsw, msw, lowOrder, highOrder;\n\n lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);\n msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);\n lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);\n msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);\n highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n return new int64(highOrder, lowOrder);\n }\n\n function maj(x, y, z) {\n return new int64(\n (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),\n (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)\n );\n }\n\n function ch(x, y, z) {\n return new int64(\n (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),\n (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)\n );\n }\n\n function rotr(x, n) {\n if (n <= 32) {\n return new int64(\n (x.highOrder >>> n) | (x.lowOrder << (32 - n)),\n (x.lowOrder >>> n) | (x.highOrder << (32 - n))\n );\n } else {\n return new int64(\n (x.lowOrder >>> n) | (x.highOrder << (32 - n)),\n (x.highOrder >>> n) | (x.lowOrder << (32 - n))\n );\n }\n }\n\n function sigma0(x) {\n var rotr28 = rotr(x, 28);\n var rotr34 = rotr(x, 34);\n var rotr39 = rotr(x, 39);\n\n return new int64(\n rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,\n rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder\n );\n }\n\n function sigma1(x) {\n var rotr14 = rotr(x, 14);\n var rotr18 = rotr(x, 18);\n var rotr41 = rotr(x, 41);\n\n return new int64(\n rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,\n rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder\n );\n }\n\n function gamma0(x) {\n var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);\n\n return new int64(\n rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,\n rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder\n );\n }\n\n function gamma1(x) {\n var rotr19 = rotr(x, 19);\n var rotr61 = rotr(x, 61);\n var shr6 = shr(x, 6);\n\n return new int64(\n rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,\n rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder\n );\n }\n\n function shr(x, n) {\n if (n <= 32) {\n return new int64(\n x.highOrder >>> n,\n x.lowOrder >>> n | (x.highOrder << (32 - n))\n );\n } else {\n return new int64(\n 0,\n x.highOrder << (32 - n)\n );\n }\n }\n\n str = utf8_encode(str);\n strlen = str.length*charsize;\n str = str2binb(str);\n\n str[strlen >> 5] |= 0x80 << (24 - strlen % 32);\n str[(((strlen + 128) >> 10) << 5) + 31] = strlen;\n\n for (var i = 0; i < str.length; i += 32) {\n a = H[0];\n b = H[1];\n c = H[2];\n d = H[3];\n e = H[4];\n f = H[5];\n g = H[6];\n h = H[7];\n\n for (var j = 0; j < 80; j++) {\n if (j < 16) {\n W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);\n } else {\n W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);\n }\n\n T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);\n T2 = safe_add_2(sigma0(a), maj(a, b, c));\n h = g;\n g = f;\n f = e;\n e = safe_add_2(d, T1);\n d = c;\n c = b;\n b = a;\n a = safe_add_2(T1, T2);\n }\n\n H[0] = safe_add_2(a, H[0]);\n H[1] = safe_add_2(b, H[1]);\n H[2] = safe_add_2(c, H[2]);\n H[3] = safe_add_2(d, H[3]);\n H[4] = safe_add_2(e, H[4]);\n H[5] = safe_add_2(f, H[5]);\n H[6] = safe_add_2(g, H[6]);\n H[7] = safe_add_2(h, H[7]);\n }\n\n var binarray = [];\n for (var i = 0; i < H.length; i++) {\n binarray.push(H[i].highOrder);\n binarray.push(H[i].lowOrder);\n }\n return binb2hex(binarray);\n}\nmodule.exports.sha512ArrayBuffer = function SHA512(ab) {\nvar str = loadModule(\"utility.js\").ab2str(ab)\n function int64(msint_32, lsint_32) {\n this.highOrder = msint_32;\n this.lowOrder = lsint_32;\n }\n\n var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),\n new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),\n new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),\n new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];\n\n var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),\n new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),\n new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),\n new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),\n new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),\n new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),\n new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),\n new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),\n new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),\n new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),\n new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),\n new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),\n new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),\n new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),\n new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),\n new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),\n new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),\n new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),\n new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),\n new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),\n new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),\n new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),\n new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),\n new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),\n new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),\n new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),\n new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),\n new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),\n new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),\n new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),\n new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),\n new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),\n new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),\n new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),\n new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),\n new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),\n new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),\n new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),\n new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),\n new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];\n\n var W = new Array(64);\n var a, b, c, d, e, f, g, h, i, j;\n var T1, T2;\n var charsize = 8;\n\n function utf8_encode(str) {\n return unescape(encodeURIComponent(str));\n }\n\n function str2binb(str) {\n var bin = [];\n var mask = (1 << charsize) - 1;\n var len = str.length * charsize;\n\n for (var i = 0; i < len; i += charsize) {\n bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));\n }\n\n return bin;\n }\n\n function binb2hex(binarray) {\n var hex_tab = \'0123456789abcdef\';\n var str = \'\';\n var length = binarray.length * 4;\n var srcByte;\n\n for (var i = 0; i < length; i += 1) {\n srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);\n str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);\n }\n\n return str;\n }\n\n function safe_add_2(x, y) {\n var lsw, msw, lowOrder, highOrder;\n\n lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);\n msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);\n lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);\n msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);\n highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n return new int64(highOrder, lowOrder);\n }\n\n function safe_add_4(a, b, c, d) {\n var lsw, msw, lowOrder, highOrder;\n\n lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);\n msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);\n lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);\n msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);\n highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n return new int64(highOrder, lowOrder);\n }\n\n function safe_add_5(a, b, c, d, e) {\n var lsw, msw, lowOrder, highOrder;\n\n lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);\n msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);\n lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);\n msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);\n highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);\n\n return new int64(highOrder, lowOrder);\n }\n\n function maj(x, y, z) {\n return new int64(\n (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),\n (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)\n );\n }\n\n function ch(x, y, z) {\n return new int64(\n (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),\n (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)\n );\n }\n\n function rotr(x, n) {\n if (n <= 32) {\n return new int64(\n (x.highOrder >>> n) | (x.lowOrder << (32 - n)),\n (x.lowOrder >>> n) | (x.highOrder << (32 - n))\n );\n } else {\n return new int64(\n (x.lowOrder >>> n) | (x.highOrder << (32 - n)),\n (x.highOrder >>> n) | (x.lowOrder << (32 - n))\n );\n }\n }\n\n function sigma0(x) {\n var rotr28 = rotr(x, 28);\n var rotr34 = rotr(x, 34);\n var rotr39 = rotr(x, 39);\n\n return new int64(\n rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,\n rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder\n );\n }\n\n function sigma1(x) {\n var rotr14 = rotr(x, 14);\n var rotr18 = rotr(x, 18);\n var rotr41 = rotr(x, 41);\n\n return new int64(\n rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,\n rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder\n );\n }\n\n function gamma0(x) {\n var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);\n\n return new int64(\n rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,\n rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder\n );\n }\n\n function gamma1(x) {\n var rotr19 = rotr(x, 19);\n var rotr61 = rotr(x, 61);\n var shr6 = shr(x, 6);\n\n return new int64(\n rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,\n rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder\n );\n }\n\n function shr(x, n) {\n if (n <= 32) {\n return new int64(\n x.highOrder >>> n,\n x.lowOrder >>> n | (x.highOrder << (32 - n))\n );\n } else {\n return new int64(\n 0,\n x.highOrder << (32 - n)\n );\n }\n }\n\n str = utf8_encode(str);\n strlen = str.length*charsize;\n str = str2binb(str);\n\n str[strlen >> 5] |= 0x80 << (24 - strlen % 32);\n str[(((strlen + 128) >> 10) << 5) + 31] = strlen;\n\n for (var i = 0; i < str.length; i += 32) {\n a = H[0];\n b = H[1];\n c = H[2];\n d = H[3];\n e = H[4];\n f = H[5];\n g = H[6];\n h = H[7];\n\n for (var j = 0; j < 80; j++) {\n if (j < 16) {\n W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);\n } else {\n W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);\n }\n\n T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);\n T2 = safe_add_2(sigma0(a), maj(a, b, c));\n h = g;\n g = f;\n f = e;\n e = safe_add_2(d, T1);\n d = c;\n c = b;\n b = a;\n a = safe_add_2(T1, T2);\n }\n\n H[0] = safe_add_2(a, H[0]);\n H[1] = safe_add_2(b, H[1]);\n H[2] = safe_add_2(c, H[2]);\n H[3] = safe_add_2(d, H[3]);\n H[4] = safe_add_2(e, H[4]);\n H[5] = safe_add_2(f, H[5]);\n H[6] = safe_add_2(g, H[6]);\n H[7] = safe_add_2(h, H[7]);\n }\n\n var binarray = [];\n for (var i = 0; i < H.length; i++) {\n binarray.push(H[i].highOrder);\n binarray.push(H[i].lowOrder);\n }\n return binb2hex(binarray);\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/sha.js';
    moduleCache["terminal.js"] = 'module.exports = class Terminal {\n    up() {\n        process.stdout.write(\"\\x1B[A\")\n    }\n    down() {\n        process.stdout.write(\"\\x1B[B\")\n    }\n    left() {\n        process.stdout.write(\"\\x1B[D\")\n    }\n    right() {\n        process.stdout.write(\"\\x1B[C\")\n    }\n    setPosition(rowfunction, colfunction) {\n        if (0 === row || col === 0) {\n            return\n        }\n        process.stdout.write(\"\\x1B[\" + String(row) + \";\" + String(col) + \"H\")\n    }\n    hide() {\n        process.stdout.write(\"\\x1B[?25l\")\n    }\n    show() {\n        process.stdout.write(\"\\x1B[?12l\\x1B[?25h\")\n    }\n    setTextAttributeByName(name, remove = false) {\n        let properties = {\n            \"bold\": \"1\",\n            \"dim\": \"2\",\n            \"underline\": \"4\",\n            \"blink\": \"5\",\n            \"reverse\": \"7\",\n            \"invert\": \"7\",\n            \"hidden\": \"8\"\n        }\n        let propertiesRemove = {\n            \"bold\": \"21\",\n            \"dim\": \"22\",\n            \"underline\": \"24\",\n            \"blink\": \"25\",\n            \"reverse\": \"27\",\n            \"invert\": \"27\",\n            \"hidden\": \"28\"\n        }\n        if (remove) {\n            let resultValue = propertiesRemove[name]\n            process.stdout.write(\"\\x1B[\" + resultValue + \"m\")\n        } else {\n            let resultValue = properties[name]\n            process.stdout.write(\"\\x1B[\" + resultValue + \"m\")\n        }\n    }\n    saveScreenContents() {\n        process.stdout.write(\"\\x1B[?1049h\")\n    }\n    restoreScreenContents() {\n        process.stdout.write(\"\\x1B[?1049l\")\n    }\n    resetTextProperties() {\n        process.stdout.write(\"\\x1B[0m\")\n    }\n    setAnsiTextColor(color) {\n        process.stdout.write(\"\\x1B[38;5;\" + String(color) + \"m\")\n    }\n    setAnsiBackgroundColor(color) {\n        process.stdout.write(\"\\x1B[48;5;\" + String(color) + \"m\")\n    }\n    loading(txt) {\n        var P = [\n            \"⠋\",\n            \"⠙\",\n            \"⠹\",\n            \"⠸\",\n            \"⠼\",\n            \"⠴\",\n            \"⠦\",\n            \"⠧\",\n            \"⠇\",\n            \"⠏\"\n        ]\n        var x = 0;\n        return setInterval(function() {\n            process.stdout.write(\"\\r\" + P[x++] + (txt ?(\" \" + txt) : \"\"));\n            x = x % P.length\n        }, 250);\n    }\n    setTabTitle(title) {\n        process.stdout.write(\"\\x1B]1;\\x07\")\n        process.stdout.write(\"\\x1B]1;\" + title + \"\\x07\")\n    }\n    setglobalThisTitle(title) {\n        process.stdout.write(\"\\x1B]2;\\x07\")\n        process.stdout.write(\"\\x1B]2;\" + title + \"\\x07\")\n    }\n    setDocumentTitle(title) {\n        process.stdout.write(\"\\x1B]6;\\x07\")\n        process.stdout.write(\"\\x1B]6;\" + title + \"\\x07\")\n    }\n    setWorkingDirectoryTitle(title) {\n        process.stdout.write(\"\\x1B]7;\\x07\")\n        process.stdout.write(\"\\x1B]7;\" + title + \"\\x07\")\n    }\n    bell() {\n        process.stdout.write(\"\\x07\")\n    }\n	  clearLine(){\n		    process.stdout.write(\"\\r\\x1B[2K\")\n	  }\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/terminal.js';
    moduleCache["touchpolyfill.js"] = '/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nif (this.globalThis){\n  // polyfill touch functionality on browsers that have pointer functionality (that piece of trash internet explorer)\n  // this thing is mostly just a hack on handjs, but does the reverse\n  // cameron henlin, cam.henlin@gmail.com\n\n  // jslint directive\n  /*jslint browser: true, unparam: true, nomen: true*/\n  /*global HTMLBodyElement, HTMLDivElement, HTMLImageElement, HTMLUListElement, HTMLAnchorElement, HTMLLIElement, HTMLTableElement, HTMLSpanElement, HTMLCanvasElement, SVGElement*/\n\n  (function () {\n      // We should start using \'use strict\' as soon as we can get rid of the implied globals.\n      // \'use strict\';\n\n      // the timestamp of the last touch event processed.\n      // It is used to determine what touches should be in the changedTouches TouchList array.\n      var lastHwTimestamp = 0,\n      // whether or not to log events to console\n          logToConsole = false,\n          userAgent = navigator.userAgent,\n          supportedEventsNames = [\"touchstart\", \"touchmove\", \"touchend\", \"touchcancel\", \"touchleave\"],\n      // commented out because not used\n      // upperCaseEventsNames = [\"TouchStart\", \"TouchMove\", \"TouchEnd\", \"TouchCancel\", \"TouchLeave\"],\n          previousTargets = {},\n      // wraps a W3C compliant implementation of the \"touches\" TouchList\n          touchesWrapper,\n      // wraps a W3C compliant implementation of the \"changedTouches\" TouchList\n          changedTouchesWrapper,\n      // wraps a W3C compliant implementation of the \"targetTouches\" TouchList\n          targetTouchesWrapper;\n\n      // a constructor for an object that wraps a W3C compliant TouchList.\n      function TouchListWrapper() {\n          var touchList = []; // an array of W3C compliant Touch objects.\n\n          // constructor for W3C compliant touch object\n          // http://www.w3.org/TR/touch-events/\n          function Touch(identifier, target, screenX, screenY, clientX, clientY, pageX, pageY) {\n              this.identifier = identifier;\n              this.target = target;\n              this.screenX = screenX;\n              this.screenY = screenY;\n              this.clientX = clientX;\n              this.clientY = clientY;\n              this.pageX = pageX;\n              this.pageY = pageY;\n          }\n\n          // Search the TouchList for a Touch with the given identifier.\n          // If it is found, return it.  Otherwise, return null;\n          function getTouch(identifier) {\n              var i;\n              for (i = 0; i < touchList.length; i += 1) {\n                  if (touchList[i].identifier === identifier) {\n                      return touchList[i];\n                  }\n              }\n          }\n\n          // If this is a new touch, add it to the TouchList.\n          // If this is an existing touch, update it in the TouchList.\n          function addUpdateTouch(touch) {\n              var i;\n              for (i = 0; i < touchList.length; i += 1) {\n                  if (touchList[i].identifier === touch.identifier) {\n                      touchList[i] = touch;\n                      return;\n                  }\n              }\n              // If we finished the loop, then this is a new touch.\n              touchList.push(touch);\n          }\n\n          function removeTouch(identifier) {\n              var i;\n              for (i = 0; i < touchList.length; i += 1) {\n                  if (touchList[i].identifier === identifier) {\n                      touchList.splice(i, 1);\n                  }\n              }\n          }\n\n          function clearTouches() {\n              // According to http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript\n              // this is the fastest way to clear the array.\n              while (touchList.length > 0) {\n                  touchList.pop();\n              }\n          }\n\n          // Return true if the current TouchList object contains a touch at the specified screenX, clientY.\n          // Returns false otherwise.\n          // This is used to differentiate touches that have moved from those that haven\'t.\n          function containsTouchAt(screenX, screenY) {\n              var i;\n\n              for (i = 0; i < touchList.length; i += 1) {\n                  if (touchList[i].screenX === screenX && touchList[i].screenY === screenY) {\n                      return true;\n                  }\n              }\n\n              return false;\n          }\n\n          // touchList is the actual W3C compliant TouchList object being emulated.\n          this.touchList = touchList;\n\n          this.Touch = Touch;\n          this.getTouch = getTouch;\n          this.addUpdateTouch = addUpdateTouch;\n          this.removeTouch = removeTouch;\n          this.clearTouches = clearTouches;\n          this.containsTouchAt = containsTouchAt;\n      }\n\n      function touchesAreAtSameSpot(touch0, touch1) {\n          return touch0.screenX === touch1.screenX && touch0.screenY === touch1.screenY;\n      }\n\n      // polyfill custom event\n      function CustomEvent(event, params) {\n          var evt;\n          params = params || {\n              bubbles: false,\n              cancelable: false,\n              detail: undefined\n          };\n          evt = document.createEvent(\"CustomEvent\");\n          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);\n          return evt;\n      }\n\n      function checkPreventDefault(node) {\n          while (node && !node.handJobjs_forcePreventDefault) {\n              node = node.parentNode;\n          }\n          return !!node || globalThis.handJobjs_forcePreventDefault;\n      }\n\n      // Touch events\n      function generateTouchClonedEvent(sourceEvent, newName, canBubble, target, relatedTarget) {\n          var evObj, oldTouch, oldTarget;\n\n          // Updates the targetTouches so that it contains the touches from the \"touches\" TouchList\n          // that have the same target as the touch that triggered this event.\n          function updateTargetTouches(thisTouchTarget, touchesTouchList) {\n              var i, touch;\n\n              targetTouchesWrapper.clearTouches();\n\n              for (i = 0; i < touchesTouchList.length; i++) {\n                  touch = touchesTouchList[i];\n                  if (touch.target.isSameNode(thisTouchTarget)) {\n                      targetTouchesWrapper.addUpdateTouch(touch);\n                  }\n              }\n          }\n\n          function touchHandler(event) {\n              var eventType,\n                  oldTouch,\n                  touch,\n                  touchEvent,\n                  isTouchChanged;\n\n              log(\"touch!\");\n\n              if (event.type === \"pointerdown\") {\n                  eventType = \"touchstart\";\n              } else if (event.type === \"pointermove\") {\n                  eventType = \"touchmove\";\n              } else {\n                  throw new Error(\'touchHandler received invalid event type: \' + eventType + \'. Valid event types are pointerdown and pointermove\');\n              }\n              log(eventType);\n\n              touch = new touchesWrapper.Touch(event.pointerId, (event.type === \'pointerdown\' ? event.target : oldTarget),\n                  event.screenX, event.screenY, event.clientX, event.clientY, event.pageX, event.pageY);\n\n              // Remove, from changedTouches, any Touch that is no longer being touched, or is being touched\n              // in exactly the same place.\n              // In order to make sure that simultaneous touches don\'t kick each other off of the changedTouches array\n              // (because they are processed as different pointer events), skip this if the lastHwTimestamp hasn\'t increased.\n              if (event.hwTimestamp > lastHwTimestamp) {\n                  (function () {\n                      var i, changedTouchList, changedTouch, matchingTouch, identifier;\n                      changedTouchList = changedTouchesWrapper.touchList;\n                      for (i = 0; i < changedTouchList.length; i += 1) {\n                          changedTouch = changedTouchList[i];\n                          identifier = changedTouch.identifier;\n                          matchingTouch = touchesWrapper.getTouch(identifier);\n\n                          if (!matchingTouch || touchesAreAtSameSpot(matchingTouch, changedTouch)) {\n                              changedTouchesWrapper.removeTouch(identifier);\n                          }\n                      }\n                  } ());\n              }\n\n              log(\"generating touch cloned\");\n\n              touchesWrapper.addUpdateTouch(touch);\n              changedTouchesWrapper.addUpdateTouch(touch);\n              updateTargetTouches(touch.target, touchesWrapper.touchList);\n\n              event.type = eventType;\n              touchEvent = new CustomEvent(eventType, { bubbles: true, cancelable: true });\n\n              touchEvent.touches = touchesWrapper.touchList;\n              touchEvent.changedTouches = changedTouchesWrapper.touchList;\n              touchEvent.targetTouches = targetTouchesWrapper.touchList;\n              touchEvent.type = eventType;\n\n              // Awesomely, I figured out how to keep track of the touches in the \"Touches\" TouchList using an array.\n              // TODO: Do the same thing for the changedTouches and targetTouches properties of the TouchEvent.\n              // TODONE! changedTouches is implemented.\n              // TODONE! targetTouches is implemented.\n\n              // The other members of the TouchEvent are altKey, metaKey, ctrlKey, and shiftKey\n\n              return touchEvent;\n          }\n\n          function touchChangedHandler(event) {\n              var eventType,\n                  touch,\n                  touchEvent;\n\n              log(\"touchchanged!\");\n              event.changedTouches = [];\n              event.changedTouches.length = 1;\n              event.changedTouches[0] = event;\n              event.changedTouches[0].identifier = event.pointerId;\n\n              if (event.type === \"pointerup\") {\n                  eventType = \"touchend\";\n              } else if (event.type === \"pointercancel\") {\n                  eventType = \"touchcancel\";\n              } else if (event.type === \"pointerleave\") {\n                  eventType = \"touchleave\";\n              }\n\n              touch = new touchesWrapper.Touch(event.pointerId, oldTarget, event.screenX, event.screenY, event.clientX, event.clientY, event.pageX, event.pageY);\n\n              // This is a new touch event if it happened at a greater time than the last touch event.\n              // If it is a new touch event, clear out the changedTouches TouchList.\n              if (event.hwTimestamp > lastHwTimestamp) {\n                  changedTouchesWrapper.clearTouches();\n              }\n\n              touchesWrapper.removeTouch(touch.identifier);\n              changedTouchesWrapper.addUpdateTouch(touch);\n              updateTargetTouches(touch.target, touchesWrapper.touchList);\n\n              event.type = eventType;\n              touchEvent = new CustomEvent(eventType, { bubbles: true, cancelable: true });\n              touchEvent.touches = touchesWrapper.touchList;\n              touchEvent.changedTouches = changedTouchesWrapper.touchList;\n              touchEvent.targetTouches = targetTouchesWrapper.touchList;\n              touchEvent.type = eventType;\n\n              return touchEvent;\n          }\n\n          // An important difference between the MS pointer events and the W3C touch events\n          // is that for pointer events except for pointerdown, all target the element that the touch\n          // is over when the event is fired.\n          // The W3C touch events target the element where the touch originally started.\n          // Therefore, when these events are fired, we must make this change manually.\n          if (sourceEvent.type !== \'pointerdown\') {\n              oldTouch = touchesWrapper.getTouch(sourceEvent.pointerId);\n              oldTarget = oldTouch.target;\n              sourceEvent.target = oldTarget;\n          }\n\n          if (sourceEvent.type === \"pointerdown\" || sourceEvent.type === \"pointermove\") {\n              evObj = touchHandler(sourceEvent);\n          } else {\n              evObj = touchChangedHandler(sourceEvent);\n          }\n\n          // PreventDefault\n          evObj.preventDefault = function () {\n              if (sourceEvent.preventDefault !== undefined) {\n                  sourceEvent.preventDefault();\n              }\n          };\n\n          // Fire event\n          log(\"dispatching!\");\n          sourceEvent.target.dispatchEvent(evObj);\n\n          lastHwTimestamp = event.hwTimestamp;\n      }\n\n      function generateTouchEventProxy(name, touchPoint, target, eventObject, canBubble, relatedTarget) {\n          generateTouchClonedEvent(touchPoint, name, canBubble, target, relatedTarget);\n      }\n\n      function registerOrUnregisterEvent(item, name, func, enable) {\n          log(\"registerOrUnregisterEvent\");\n          if (item.__handJobjsRegisteredEvents === undefined) {\n              item.__handJobjsRegisteredEvents = [];\n          }\n\n          if (enable) {\n              if (item.__handJobjsRegisteredEvents[name] !== undefined) {\n                  item.__handJobjsRegisteredEvents[name] += 1;\n                  return;\n              }\n\n              item.__handJobjsRegisteredEvents[name] = 1;\n              log(\"adding event \" + name);\n              item.addEventListener(name, func, false);\n          } else {\n\n              if (item.__handJobjsRegisteredEvents.indexOf(name) !== -1) {\n                  item.__handJobjsRegisteredEvents[name] -= 1;\n\n                  if (item.__handJobjsRegisteredEvents[name] !== 0) {\n                      return;\n                  }\n              }\n              log(\"removing event\");\n              item.removeEventListener(name, func);\n              item.__handJobjsRegisteredEvents[name] = 0;\n          }\n      }\n\n      function setTouchAware(item, eventName, enable) {\n          var eventGenerator,\n              targetEvent;\n\n          function nameGenerator(name) {\n              return name;\n          } // easier than doing this right and replacing all the references\n\n          log(\"setTouchAware \" + enable + \" \" + eventName);\n          // Leaving tokens\n          if (!item.__handJobjsGlobalRegisteredEvents) {\n              item.__handJobjsGlobalRegisteredEvents = [];\n          }\n          if (enable) {\n              if (item.__handJobjsGlobalRegisteredEvents[eventName] !== undefined) {\n                  item.__handJobjsGlobalRegisteredEvents[eventName] += 1;\n                  return;\n              }\n              item.__handJobjsGlobalRegisteredEvents[eventName] = 1;\n\n              log(item.__handJobjsGlobalRegisteredEvents[eventName]);\n          } else {\n              if (item.__handJobjsGlobalRegisteredEvents[eventName] !== undefined) {\n                  item.__handJobjsGlobalRegisteredEvents[eventName] -= 1;\n                  if (item.__handJobjsGlobalRegisteredEvents[eventName] < 0) {\n                      item.__handJobjsGlobalRegisteredEvents[eventName] = 0;\n                  }\n              }\n          }\n\n          eventGenerator = generateTouchClonedEvent;\n\n          //switch (eventName) {\n          //    case \"touchenter\":\n          //      log(\"touchenter\");\n          //      break;\n          //    case \"touchleave\":\n          //      log(\"touchleave\");\n          targetEvent = nameGenerator(eventName);\n\n          if (item[\'on\' + targetEvent.toLowerCase()] !== undefined) {\n              registerOrUnregisterEvent(item, targetEvent, function (evt) { eventGenerator(evt, eventName); }, enable);\n          }\n          //        break;\n          //}\n      }\n\n      // Intercept addEventListener calls by changing the prototype\n      function interceptAddEventListener(root) {\n          var current = root.prototype ? root.prototype.addEventListener : root.addEventListener;\n\n          function customAddEventListener(name, func, capture) {\n              log(\"customAddEventListener\");\n              log(name);\n\n              if (supportedEventsNames.indexOf(name) !== -1) {\n                  log(\"setting touch aware...\");\n                  setTouchAware(this, name, true);\n              }\n              current.call(this, name, func, capture);\n          }\n\n          log(\"intercepting add event listener!\");\n          log(root);\n\n          if (root.prototype) {\n              root.prototype.addEventListener = customAddEventListener;\n          } else {\n              root.addEventListener = customAddEventListener;\n          }\n      }\n\n      function handleOtherEvent(eventObject, name) {\n          log(\"handle other event\");\n          if (eventObject.preventManipulation) {\n              eventObject.preventManipulation();\n          }\n\n          // TODO: JSLint found that touchPoint here is an implied global!\n          generateTouchClonedEvent(touchPoint, name);\n      }\n\n      function removeTouchAware(item, eventName) {\n          // If item is already touch aware, do nothing\n          if (item.ontouchdown !== undefined) {\n              return;\n          }\n\n          // Chrome, Firefox\n          if (item.ontouchstart !== undefined) {\n              switch (eventName.toLowerCase()) {\n                  case \"touchstart\":\n                      item.removeEventListener(\"pointerdown\", function (evt) { handleOtherEvent(evt, eventName); });\n                      break;\n                  case \"touchmove\":\n                      item.removeEventListener(\"pointermove\", function (evt) { handleOtherEvent(evt, eventName); });\n                      break;\n                  case \"touchend\":\n                      item.removeEventListener(\"pointerup\", function (evt) { handleOtherEvent(evt, eventName); });\n                      break;\n                  case \"touchcancel\":\n                      item.removeEventListener(\"pointercancel\", function (evt) { handleOtherEvent(evt, eventName); });\n                      break;\n              }\n          }\n      }\n\n      // Intercept removeEventListener calls by changing the prototype\n      function interceptRemoveEventListener(root) {\n          var current = root.prototype ? root.prototype.removeEventListener : root.removeEventListener;\n\n          function customRemoveEventListener(name, func, capture) {\n              // Branch when a PointerXXX is used\n              if (supportedEventsNames.indexOf(name) !== -1) {\n                  removeTouchAware(this, name);\n              }\n\n              current.call(this, name, func, capture);\n          }\n\n          if (root.prototype) {\n              root.prototype.removeEventListener = customRemoveEventListener;\n          } else {\n              root.removeEventListener = customRemoveEventListener;\n          }\n      }\n\n      function checkEventRegistration(node, eventName) {\n          log(\"checkEventRegistration\");\n          return node.__handJobjsGlobalRegisteredEvents && node.__handJobjsGlobalRegisteredEvents[eventName];\n      }\n\n      function findEventRegisteredNode(node, eventName) {\n          log(\"findEventRegisteredNode\");\n          while (node && !checkEventRegistration(node, eventName)) {\n              node = node.parentNode;\n          }\n          if (node) {\n              return node;\n          }\n          if (checkEventRegistration(globalThis, eventName)) {\n              return globalThis;\n          }\n      }\n\n      function generateTouchEventProxyIfRegistered(eventName, touchPoint, target, eventObject, canBubble, relatedTarget) { // Check if user registered this event\n          log(\"generateTouchEventProxyIfRegistered\");\n          if (findEventRegisteredNode(target, eventName)) {\n              generateTouchEventProxy(eventName, touchPoint, target, eventObject, canBubble, relatedTarget);\n          }\n      }\n\n      function getDomUpperHierarchy(node) {\n          var nodes = [];\n          if (node) {\n              nodes.unshift(node);\n              while (node.parentNode) {\n                  nodes.unshift(node.parentNode);\n                  node = node.parentNode;\n              }\n          }\n          return nodes;\n      }\n\n      function getFirstCommonNode(node1, node2) {\n          var parents1 = getDomUpperHierarchy(node1),\n              parents2 = getDomUpperHierarchy(node2),\n              lastmatch = null;\n\n          while (parents1.length > 0 && parents1[0] === parents2.shift()) {\n              lastmatch = parents1.shift();\n          }\n          return lastmatch;\n      }\n\n      // generateProxy receives a node to dispatch the event\n      function dispatchPointerEnter(currentTarget, relatedTarget, generateProxy) {\n          log(\"dispatchPointerEnter\");\n          var commonParent = getFirstCommonNode(currentTarget, relatedTarget),\n              node = currentTarget,\n              nodelist = [];\n\n          while (node && node !== commonParent) { // target range: this to the direct child of parent relatedTarget\n              if (checkEventRegistration(node, \"touchenter\")) {\n                  // check if any parent node has pointerenter\n                  nodelist.push(node);\n              }\n              node = node.parentNode;\n          }\n          while (nodelist.length > 0) {\n              generateProxy(nodelist.pop());\n          }\n      }\n\n      // generateProxy receives a node to dispatch the event\n      function dispatchPointerLeave(currentTarget, relatedTarget, generateProxy) {\n          log(\"dispatchPointerLeave\");\n          var commonParent = getFirstCommonNode(currentTarget, relatedTarget),\n              node = currentTarget;\n          while (node && node !== commonParent) {//target range: this to the direct child of parent relatedTarget\n              if (checkEventRegistration(node, \"touchleave\")) {\n                  // check if any parent node has pointerleave\n                  generateProxy(node);\n              }\n              node = node.parentNode;\n          }\n      }\n\n      function log(s) {\n          if (logToConsole) {\n              console.log(s.toString());\n          }\n      }\n\n      CustomEvent.prototype = globalThis.Event.prototype;\n\n      if (typeof (globalThis.ontouchstart) === \"object\") {\n          return;\n      }\n\n      if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || userAgent.match(/Android/i) || (userAgent.match(/MSIE/i) && !userAgent.match(/Touch/i))) {\n          return;\n      }\n\n      // Add CSS to disable MS IE default scrolling functionality.\n      (function () {\n          var css = \'html { -ms-touch-action: none; }\',\n              head = document.head || document.getElementsByTagName(\'head\')[0],\n              style = document.createElement(\'style\');\n\n          style.type = \'text/css\';\n          if (style.styleSheet) {\n              style.styleSheet.cssText = css;\n          } else {\n              style.appendChild(document.createTextNode(css));\n          }\n\n          head.appendChild(style);\n      } ());\n\n      touchesWrapper = new TouchListWrapper();\n      changedTouchesWrapper = new TouchListWrapper();\n      targetTouchesWrapper = new TouchListWrapper();\n\n      globalThis.CustomEvent = CustomEvent;\n\n      // Hooks\n      interceptAddEventListener(globalThis);\n      interceptAddEventListener(globalThis.HTMLElement || globalThis.Element);\n      interceptAddEventListener(document);\n      interceptAddEventListener(HTMLBodyElement);\n      interceptAddEventListener(HTMLDivElement);\n      interceptAddEventListener(HTMLImageElement);\n      interceptAddEventListener(HTMLUListElement);\n      interceptAddEventListener(HTMLAnchorElement);\n      interceptAddEventListener(HTMLLIElement);\n      interceptAddEventListener(HTMLTableElement);\n      if (globalThis.HTMLSpanElement) {\n          interceptAddEventListener(HTMLSpanElement);\n      }\n      if (globalThis.HTMLCanvasElement) {\n          interceptAddEventListener(HTMLCanvasElement);\n      }\n      if (globalThis.SVGElement) {\n          interceptAddEventListener(SVGElement);\n      }\n\n      interceptRemoveEventListener(globalThis);\n      interceptRemoveEventListener(globalThis.HTMLElement || globalThis.Element);\n      interceptRemoveEventListener(document);\n      interceptRemoveEventListener(HTMLBodyElement);\n      interceptRemoveEventListener(HTMLDivElement);\n      interceptRemoveEventListener(HTMLImageElement);\n      interceptRemoveEventListener(HTMLUListElement);\n      interceptRemoveEventListener(HTMLAnchorElement);\n      interceptRemoveEventListener(HTMLLIElement);\n      interceptRemoveEventListener(HTMLTableElement);\n      if (globalThis.HTMLSpanElement) {\n          interceptRemoveEventListener(HTMLSpanElement);\n      }\n      if (globalThis.HTMLCanvasElement) {\n          interceptRemoveEventListener(HTMLCanvasElement);\n      }\n      if (globalThis.SVGElement) {\n          interceptRemoveEventListener(SVGElement);\n      }\n\n      (function () {\n          // Returns true if and only if the event should be ignored.\n          function ignorePointerEvent(event) {\n              // Don\'t interpret mouse pointers as touches\n              if (event.pointerType === \'mouse\') {\n                  return true;\n              }\n              // Don\'t interpret pointerdown events on the scrollbars as touch events.\n              // It appears to be the case that when the event is on the scrollbar in IE,\n              // event.x === 0 and event.y === 0\n              if (event.type === \'pointerdown\' && event.x === 0 && event.y === 0) {\n                  return true;\n              }\n              // A user reported that when the input type is \'pen\', the pointermove event fires with a pressure of 0\n              // before the pen touches the screen.  We want to ignore this.\n              if (event.pointerType === \'pen\' && event.pressure === 0 && event.type === \'pointermove\') {\n                  return true;\n              }\n              return false;\n          }\n\n          // Handling move on globalThis to detect pointerleave/out/over\n          globalThis.addEventListener(\'pointerdown\', function (eventObject) {\n              log(\"pointerdownfired\");\n              var touchPoint = eventObject;\n\n              if (ignorePointerEvent(eventObject)) {\n                  return;\n              }\n\n              previousTargets[touchPoint.identifier] = touchPoint.target;\n              generateTouchEventProxyIfRegistered(\"touchenter\", touchPoint, touchPoint.target, eventObject, true);\n\n              // pointerenter should not be bubbled\n              dispatchPointerEnter(touchPoint.target, null, function (targetNode) {\n                  generateTouchEventProxy(\"touchenter\", touchPoint, targetNode, eventObject, false);\n              });\n\n              generateTouchEventProxyIfRegistered(\"touchstart\", touchPoint, touchPoint.target, eventObject, true);\n          });\n\n          globalThis.addEventListener(\'pointerup\', function (eventObject) {\n              var touchPoint = eventObject,\n                      currentTarget = previousTargets[touchPoint.identifier];\n\n              log(\"pointer up fired\");\n\n              if (ignorePointerEvent(eventObject)) {\n                  return;\n              }\n\n              generateTouchEventProxyIfRegistered(\"touchend\", touchPoint, currentTarget, eventObject, true);\n              generateTouchEventProxyIfRegistered(\"touchleave\", touchPoint, currentTarget, eventObject, true);\n\n              //pointerleave should not be bubbled\n              dispatchPointerLeave(currentTarget, null, function (targetNode) {\n                  generateTouchEventProxy(\"touchleave\", touchPoint, targetNode, eventObject, false);\n              });\n          });\n\n          globalThis.addEventListener(\'pointermove\', function (eventObject) {\n              var touchPoint = eventObject,\n                      currentTarget = previousTargets[touchPoint.identifier];\n\n              log(\"pointer move fired\");\n\n              if (ignorePointerEvent(eventObject)) {\n                  return;\n              }\n\n              log(\'x: \' + eventObject.screenX + \', y: \' + eventObject.screenY);\n\n              // pointermove fires over and over when a touch-point stays stationary.\n              // This is at odds with the other browsers that implement the W3C standard touch events\n              // which fire touchmove only when the touch-point actually moves.\n              // Therefore, return without doing anything if the pointermove event fired for a touch\n              // that hasn\'t moved.\n              if (touchesWrapper.containsTouchAt(eventObject.screenX, eventObject.screenY)) {\n                  return;\n              }\n\n              // If force preventDefault\n              if (currentTarget && checkPreventDefault(currentTarget) === true) {\n                  eventObject.preventDefault();\n              }\n\n              generateTouchEventProxyIfRegistered(\"touchmove\", touchPoint, currentTarget, eventObject, true);\n          });\n      } ());\n  } ());\n\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/touchpolyfill.js';
    moduleCache["utility.js"] = 'module.exports.ab2str = function ab2str(buf) {\n    return String.fromCharCode.apply(null, new Uint8Array(buf));\n}\nmodule.exports.str2ab = function str2ab(str) {\n    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char\n    var bufView = new Uint8Array(buf);\n    for (var i = 0, strLen = str.length; i < strLen; i++) {\n        bufView[i] = str.charCodeAt(i);\n    }\n    return buf;\n}\nmodule.exports.fetchArrayBuffer = function fetchArrayBuffer(url, callback) {\n    var xhr = new XMLHttpRequest();\n    xhr.open(\'get\', url);\n    xhr.responseType = \'arraybuffer\';\n    xhr.onload = function () {\n        callback(xhr.response);\n    };\n    xhr.send();\n}\nmodule.exports.SmileJSError = function (err, stack = \"\") {\n    var proto = {\n        name: \"SmileJSError\"\n        , [Symbol.toStringTag]: \"SmileJSError\"\n        , constructor: module.exports.SmileJSError\n    }\n    var obj = Object.create(proto)\n    obj.error = err.toString()\n    obj.stack = stack ? \"SmileJSError: \" + err + \"\\n\" + stack : \"SmileJSError: \" + err\n    return obj\n}\nmodule.exports.buf2hex = function buf2hex(buffer) {\n  return Array.prototype.map.call(new Uint8Array(buffer), x => (\'00\' + x.toString(16)).slice(-2)).join(\'\');\n}\nmodule.exports.randomHex = function randomHex(length){\n  if (this.require){\n    var crypto1 = require(\"crypto\");\n    if (length % 2 !== 0) throw \"Should be a multiple of 2.\"\n    var id = crypto1.randomBytes(length / 2).toString(\'hex\');\n    return id\n  } else {\n    if (length % 2 !== 0) throw \"Should be a multiple of 2.\"\n    function getRandomId(length) {\n        if (!length) {\n            return \'\';\n        }\n        if (globalThis.crypto){\n          var arr = new Uint8Array(length / 2);\n          crypto.getRandomValues(arr)\n          return loadModule(\"utility.js\").buf2hex(arr.buffer)\n        } else {\n          return smilejs.randomId(length,\"abcdef0987654321\")\n        }\n    }\n    return getRandomId(length)\n  }\n}\nif (this.globalThis) {\n    if (globalThis.devtoolsFormatters) {\n        devtoolsFormatters.push({\n            header: function (obj, config) {\n                if (!(obj[Symbol.toStringTag] === \"SmileJSError\")) {\n                    return null;\n                }\n                return [\"div\", {}, obj.stack]\n            }\n            , hasBody: function () {\n                return false;\n            }\n        })\n    } else {\n        globalThis.devtoolsFormatters = []\n        devtoolsFormatters.push({\n            header: function (obj, config) {\n                if (!(obj[Symbol.toStringTag] === \"SmileJSError\")) {\n                    return null;\n                }\n                return [\"div\", {}, obj.stack]\n            }\n            , hasBody: function () {\n                return false;\n            }\n        })\n    }\n}\n\n//# sourceURL=smileycreations15://smilejs/modules/utility.js';
    assets["css.css"] = 'paper {\n}\n.smilejs-button, paper-button {\n  position: relative;\n  overflow: hidden;\n  outline: none;\n  border: none;\n  background: #000;\n  color: #fff;\n  border-radius: 2px;\n  padding: 8px 16px;\n  font-size: 14px;\n  font-family: inherit;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  transition: 0.2s;\n}\n.smilejs-button:hover, paper-button:hover {\n  cursor: pointer;\n}\n.smilejs-grey-overlay {\n	transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n	z-index: 9000;\n	display: flex;\n	opacity: 1;\n	transition: opacity 100ms cubic-bezier(.165, .84, .44, 1) 10ms,z-index 0s 0s,visibility 0s 0s,transform 100ms cubic-bezier(.165, .84, .44, 1) 10ms,transform 100ms cubic-bezier(.165, .84, .44, 1) 10ms;\n	position: fixed;\n	top: 0;\n	right: 0;\n	bottom: 0;\n	left: 0;\n	align-items: center;\n	justify-content: center;\n	background-color: rgba(12,13,14,0.5);\n	backface-visibility: hidden;\n	box-sizing: inherit;\n}\n.smilejs-trap-focus:focus-within {\n    background-color: rgba(0,0,0,0.000000000000001);\n}\n.smilejs-trap-focus:not(:focus-within) {\n    background-color: rgba(0,0,0,0);\n    transition: background-color 0.001s;\n}\n.smilejs-modal {\n	max-width: 600px;\n	max-height: 100%;\n	padding: 24px;\n	border-radius: 7px;\n	background-color: #FFF;\n	box-shadow: 0 4px 12px rgba(36,39,41,0.2);\n	transition: opacity 100ms cubic-bezier(.165, .84, .44, 1) 10ms,z-index 0s 0s,visibility 0s 0s,transform 100ms cubic-bezier(.165, .84, .44, 1) 10ms,transform 100ms cubic-bezier(.165, .84, .44, 1) 10ms;\n	transform: translate3d(0, 0, 0) scale3d(1, 1, 1);\n	will-change: visibility,z-index,opacity,transform;\n	border: 0;\n	font: inherit;\n	font-size: 100%;\n	vertical-align: baseline;\n	margin:0;\n}\n.smilejs-modal:not(:focus-within) {\n	background-color: rgba(255,255,255,1); /* #fff */\n	transition: background-color 0.001s;\n}\n.smilejs-modal:focus-within {\n	background-color: rgba(255,255,254,1);\n}\n.smilejs-transparent-button {\n  background: none;\n  color: #000;\n  box-shadow: none;\n}\npaper-ripple, paper-ripple-inner {\n	display:block;\n}\npaper-ripple-inner {\n    position: absolute;\n    border-radius: 50%;\n    transform: scale(0);\n    transition: opacity 640ms ease 0s, transform 640ms ease 0s;\n}\npaper-ripple {\n    position: absolute;\n    top: 0px;\n    right: 0px;\n    bottom: 0px;\n    left: 0px;\n    overflow: hidden;\n    border-radius: inherit;\n    transform: perspective(0px);\n}\n.smilejs-ripple {\n  overflow:hidden;\n  position:relative;\n}\n.smilejs-radio {\n  border-radius:50%;\n  background-color: white;\n  height:10px;\n  width:10px;\n  display: flex;\n  border-radius: 50%;\n  background-color: grey;\n  height: 15px;\n  width: 15px;\n}\n@keyframes fade-in {\n  from {\n    visibility: hidden;\n    opacity: 0;\n  }\n  to {\n    visibility: visible;\n    opacity: 1;\n  }\n}\n@keyframes slide-show {\n  to {\n    transform: translateY(0);\n  }\n}\n.smilejs-top-left {\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  padding: 20px;\n  color: #fff;\n  line-height: 1.3;\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);\n  max-width: 350px;\n  margin: 20px;\n  top: 0;\n  left: 0;\n  transform: translateX(-420px);\n}\n@keyframes slide-in-left {\n  to {\n    transform: translateX(0);\n  }\n}\n.smilejs-top-left.smilejs-do-show {\n  animation: slide-in-left 1s ease-in-out forwards, slide-in-left 1s ease-in-out reverse forwards 5s;\n}\n.smilejs-top-left[data-notification-status=\"notice\"] {\n  background-color: #29b6f6;\n}\n.smilejs-top-left[data-notification-status=\"notice\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23077CB1\'/%3E%3Cpath d=\'M11.016,6.984V9h1.968V6.984H11.016z M11.016,17.016h1.968v-6h-1.968V17.016z\' fill=\'%23077CB1\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-left[data-notification-status=\"warning\"] {\n  background-color: #ffca28;\n}\n.smilejs-top-left[data-notification-status=\"warning\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C19100\'/%3E%3Cpath d=\'M11.016,17.016h1.968V15h-1.968V17.016z M11.016,6.983v6.001h1.968V6.983H11.016z\' fill=\'%23C19100\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-left[data-notification-status=\"error\"] {\n  background-color: #ef5350;\n}\n.smilejs-top-left[data-notification-status=\"error\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C61512\'/%3E%3Cpath d=\'M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z\' fill=\'%23C61512\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-left[data-notification-status=\"success\"] {\n  background-color: #66bb6a;\n}\n.smilejs-top-left[data-notification-status=\"success\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%2339813C\'/%3E%3Cpath d=\'M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z\' fill=\'%2339813C\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-left[data-notification-status=\"question\"] {\n  background-color: #8d6e63;\n}\n.smilejs-top-left[data-notification-status=\"question\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23513F38\'/%3E%3Cpath d=\'M12.001,6.314h-0.002c-1.996,0-3.609,1.614-3.609,3.609h1.784c0-0.977,0.85-1.784,1.826-1.784  c0.977,0,1.827,0.807,1.827,1.784c0,1.826-2.718,1.614-2.718,4.544h1.784c0-2.038,2.717-2.294,2.717-4.544  C15.609,7.928,13.997,6.314,12.001,6.314z M11.109,17.186h1.784v-1.826h-1.784V17.186z\' fill=\'%23513F38\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-left[data-notification-status=\"plain\"] {\n  background-color: #333;\n}\n.smilejs-top-right {\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  padding: 20px;\n  color: #fff;\n  line-height: 1.3;\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);\n  visibility: hidden;\n  opacity: 0;\n  max-width: 350px;\n  margin: 20px;\n  top: 0;\n  right: 0;\n}\n.smilejs-top-right.smilejs-do-show {\n  animation: fade-in 1s ease-in-out forwards, fade-in 1s ease-in-out reverse forwards 3s;\n}\n.smilejs-top-right[data-notification-status=\"notice\"] {\n  background-color: #29b6f6;\n}\n.smilejs-top-right[data-notification-status=\"notice\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23077CB1\'/%3E%3Cpath d=\'M11.016,6.984V9h1.968V6.984H11.016z M11.016,17.016h1.968v-6h-1.968V17.016z\' fill=\'%23077CB1\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-right[data-notification-status=\"warning\"] {\n  background-color: #ffca28;\n}\n.smilejs-top-right[data-notification-status=\"warning\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C19100\'/%3E%3Cpath d=\'M11.016,17.016h1.968V15h-1.968V17.016z M11.016,6.983v6.001h1.968V6.983H11.016z\' fill=\'%23C19100\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-right[data-notification-status=\"error\"] {\n  background-color: #ef5350;\n}\n.smilejs-top-right[data-notification-status=\"error\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C61512\'/%3E%3Cpath d=\'M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z\' fill=\'%23C61512\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-right[data-notification-status=\"success\"] {\n  background-color: #66bb6a;\n}\n.smilejs-top-right[data-notification-status=\"success\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%2339813C\'/%3E%3Cpath d=\'M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z\' fill=\'%2339813C\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-right[data-notification-status=\"question\"] {\n  background-color: #8d6e63;\n}\n.smilejs-top-right[data-notification-status=\"question\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23513F38\'/%3E%3Cpath d=\'M12.001,6.314h-0.002c-1.996,0-3.609,1.614-3.609,3.609h1.784c0-0.977,0.85-1.784,1.826-1.784  c0.977,0,1.827,0.807,1.827,1.784c0,1.826-2.718,1.614-2.718,4.544h1.784c0-2.038,2.717-2.294,2.717-4.544  C15.609,7.928,13.997,6.314,12.001,6.314z M11.109,17.186h1.784v-1.826h-1.784V17.186z\' fill=\'%23513F38\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-top-right[data-notification-status=\"plain\"] {\n  background-color: #333;\n}\n.smilejs-bottom-right {\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  padding: 20px;\n  color: #fff;\n  line-height: 1.3;\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);\n  max-width: 350px;\n  margin: 20px;\n  bottom: 0;\n  right: 0;\n  transform: translateX(420px);\n}\n@keyframes slide-in-right {\n  to {\n    transform: translateX(0);\n  }\n}\n.smilejs-bottom-right.smilejs-do-show {\n  animation: slide-in-right 1s ease-in-out forwards, slide-in-right 1s ease-in-out reverse forwards 3s;\n}\n.smilejs-bottom-right[data-notification-status=\"notice\"] {\n  background-color: #29b6f6;\n}\n.smilejs-bottom-right[data-notification-status=\"notice\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23077CB1\'/%3E%3Cpath d=\'M11.016,6.984V9h1.968V6.984H11.016z M11.016,17.016h1.968v-6h-1.968V17.016z\' fill=\'%23077CB1\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-right[data-notification-status=\"warning\"] {\n  background-color: #ffca28;\n}\n.smilejs-bottom-right[data-notification-status=\"warning\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C19100\'/%3E%3Cpath d=\'M11.016,17.016h1.968V15h-1.968V17.016z M11.016,6.983v6.001h1.968V6.983H11.016z\' fill=\'%23C19100\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-right[data-notification-status=\"error\"] {\n  background-color: #ef5350;\n}\n.smilejs-bottom-right[data-notification-status=\"error\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C61512\'/%3E%3Cpath d=\'M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z\' fill=\'%23C61512\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-right[data-notification-status=\"success\"] {\n  background-color: #66bb6a;\n}\n.smilejs-bottom-right[data-notification-status=\"success\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%2339813C\'/%3E%3Cpath d=\'M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z\' fill=\'%2339813C\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-right[data-notification-status=\"question\"] {\n  background-color: #8d6e63;\n}\n.smilejs-bottom-right[data-notification-status=\"question\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23513F38\'/%3E%3Cpath d=\'M12.001,6.314h-0.002c-1.996,0-3.609,1.614-3.609,3.609h1.784c0-0.977,0.85-1.784,1.826-1.784  c0.977,0,1.827,0.807,1.827,1.784c0,1.826-2.718,1.614-2.718,4.544h1.784c0-2.038,2.717-2.294,2.717-4.544  C15.609,7.928,13.997,6.314,12.001,6.314z M11.109,17.186h1.784v-1.826h-1.784V17.186z\' fill=\'%23513F38\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-right[data-notification-status=\"plain\"] {\n  background-color: #333;\n}\n.smilejs-bottom-left {\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  padding: 20px;\n  color: #fff;\n  line-height: 1.3;\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);\n  visibility: hidden;\n  opacity: 0;\n  max-width: 350px;\n  margin: 20px;\n  bottom: 0;\n  left: 0;\n}\n.smilejs-bottom-left.smilejs-do-show {\n  animation: fade-in 1s ease-in-out forwards, fade-in 1s ease-in-out reverse forwards 3s;\n}\n.smilejs-bottom-left[data-notification-status=\"notice\"] {\n  background-color: #29b6f6;\n}\n.smilejs-bottom-left[data-notification-status=\"notice\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23077CB1\'/%3E%3Cpath d=\'M11.016,6.984V9h1.968V6.984H11.016z M11.016,17.016h1.968v-6h-1.968V17.016z\' fill=\'%23077CB1\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-left[data-notification-status=\"warning\"] {\n  background-color: #ffca28;\n}\n.smilejs-bottom-left[data-notification-status=\"warning\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C19100\'/%3E%3Cpath d=\'M11.016,17.016h1.968V15h-1.968V17.016z M11.016,6.983v6.001h1.968V6.983H11.016z\' fill=\'%23C19100\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-left[data-notification-status=\"error\"] {\n  background-color: #ef5350;\n}\n.smilejs-bottom-left[data-notification-status=\"error\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C61512\'/%3E%3Cpath d=\'M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z\' fill=\'%23C61512\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-left[data-notification-status=\"success\"] {\n  background-color: #66bb6a;\n}\n.smilejs-bottom-left[data-notification-status=\"success\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%2339813C\'/%3E%3Cpath d=\'M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z\' fill=\'%2339813C\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-left[data-notification-status=\"question\"] {\n  background-color: #8d6e63;\n}\n.smilejs-bottom-left[data-notification-status=\"question\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23513F38\'/%3E%3Cpath d=\'M12.001,6.314h-0.002c-1.996,0-3.609,1.614-3.609,3.609h1.784c0-0.977,0.85-1.784,1.826-1.784  c0.977,0,1.827,0.807,1.827,1.784c0,1.826-2.718,1.614-2.718,4.544h1.784c0-2.038,2.717-2.294,2.717-4.544  C15.609,7.928,13.997,6.314,12.001,6.314z M11.109,17.186h1.784v-1.826h-1.784V17.186z\' fill=\'%23513F38\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bottom-left[data-notification-status=\"plain\"] {\n  background-color: #333;\n}\n.smilejs-bar-top {\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  padding: 20px;\n  color: #fff;\n  line-height: 1.3;\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);\n  top: 0;\n  right: 0;\n  left: 0;\n  width: 100%;\n  transform: translateY(-100%);\n}\n.smilejs-bar-top.smilejs-do-show {\n  animation: slide-show 1s forwards, slide-show 1s reverse forwards 3s;\n}\n.smilejs-bar-top[data-notification-status=\"notice\"] {\n  background-color: #29b6f6;\n}\n.smilejs-bar-top[data-notification-status=\"notice\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23077CB1\'/%3E%3Cpath d=\'M11.016,6.984V9h1.968V6.984H11.016z M11.016,17.016h1.968v-6h-1.968V17.016z\' fill=\'%23077CB1\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-top[data-notification-status=\"warning\"] {\n  background-color: #ffca28;\n}\n.smilejs-bar-top[data-notification-status=\"warning\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C19100\'/%3E%3Cpath d=\'M11.016,17.016h1.968V15h-1.968V17.016z M11.016,6.983v6.001h1.968V6.983H11.016z\' fill=\'%23C19100\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-top[data-notification-status=\"error\"] {\n  background-color: #ef5350;\n}\n.smilejs-bar-top[data-notification-status=\"error\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C61512\'/%3E%3Cpath d=\'M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z\' fill=\'%23C61512\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-top[data-notification-status=\"success\"] {\n  background-color: #66bb6a;\n}\n.smilejs-bar-top[data-notification-status=\"success\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%2339813C\'/%3E%3Cpath d=\'M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z\' fill=\'%2339813C\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-top[data-notification-status=\"question\"] {\n  background-color: #8d6e63;\n}\n.smilejs-bar-top[data-notification-status=\"question\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23513F38\'/%3E%3Cpath d=\'M12.001,6.314h-0.002c-1.996,0-3.609,1.614-3.609,3.609h1.784c0-0.977,0.85-1.784,1.826-1.784  c0.977,0,1.827,0.807,1.827,1.784c0,1.826-2.718,1.614-2.718,4.544h1.784c0-2.038,2.717-2.294,2.717-4.544  C15.609,7.928,13.997,6.314,12.001,6.314z M11.109,17.186h1.784v-1.826h-1.784V17.186z\' fill=\'%23513F38\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-top[data-notification-status=\"plain\"] {\n  background-color: #333;\n}\n.smilejs-bar-bottom {\n  position: fixed;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  padding: 20px;\n  color: #fff;\n  line-height: 1.3;\n  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.35);\n  visibility: hidden;\n  opacity: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  width: 100%;\n}\n.smilejs-bar-bottom.smilejs-do-show {\n  animation: fade-in 1s ease-in-out forwards, fade-in 1s ease-in-out reverse forwards 3s;\n}\n.smilejs-bar-bottom[data-notification-status=\"notice\"] {\n  background-color: #29b6f6;\n}\n.smilejs-bar-bottom[data-notification-status=\"notice\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23077CB1\'/%3E%3Cpath d=\'M11.016,6.984V9h1.968V6.984H11.016z M11.016,17.016h1.968v-6h-1.968V17.016z\' fill=\'%23077CB1\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-bottom[data-notification-status=\"warning\"] {\n  background-color: #ffca28;\n}\n.smilejs-bar-bottom[data-notification-status=\"warning\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C19100\'/%3E%3Cpath d=\'M11.016,17.016h1.968V15h-1.968V17.016z M11.016,6.983v6.001h1.968V6.983H11.016z\' fill=\'%23C19100\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-bottom[data-notification-status=\"error\"] {\n  background-color: #ef5350;\n}\n.smilejs-bar-bottom[data-notification-status=\"error\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23C61512\'/%3E%3Cpath d=\'M13.406,12l2.578,2.578l-1.406,1.406L12,13.406l-2.578,2.578l-1.406-1.406L10.594,12L8.016,9.421l1.406-1.405L12,10.593 l2.578-2.577l1.406,1.405L13.406,12z\' fill=\'%23C61512\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-bottom[data-notification-status=\"success\"] {\n  background-color: #66bb6a;\n}\n.smilejs-bar-bottom[data-notification-status=\"success\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%2339813C\'/%3E%3Cpath d=\'M10.477,13.136l5.085-5.085l1.406,1.406l-6.492,6.492l-3.446-3.445l1.406-1.406L10.477,13.136z\' fill=\'%2339813C\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-bottom[data-notification-status=\"question\"] {\n  background-color: #8d6e63;\n}\n.smilejs-bar-bottom[data-notification-status=\"question\"]:before {\n  content: \'\';\n  display: block;\n  width: 30px;\n  height: 30px;\n  min-width: 30px;\n  margin-right: 20px;\n  background: url(\"data:image/svg+xml,%3Csvg xmlns=\'http://www.smilejs-w3.smilejs-org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M12 3.984c4.407 0 8.016 3.609 8.016 8.016 0 4.406-3.608 8.016-8.016 8.016S3.984 16.407 3.984 12 7.593 3.984 12 3.984m0-2C6.478 1.984 1.984 6.477 1.984 12c0 5.521 4.493 10.016 10.016 10.016S22.016 17.522 22.016 12c0-5.523-4.495-10.016-10.016-10.016zm0 2c4.407 0 8.016 3.609 8.016\' fill=\'%23513F38\'/%3E%3Cpath d=\'M12.001,6.314h-0.002c-1.996,0-3.609,1.614-3.609,3.609h1.784c0-0.977,0.85-1.784,1.826-1.784  c0.977,0,1.827,0.807,1.827,1.784c0,1.826-2.718,1.614-2.718,4.544h1.784c0-2.038,2.717-2.294,2.717-4.544  C15.609,7.928,13.997,6.314,12.001,6.314z M11.109,17.186h1.784v-1.826h-1.784V17.186z\' fill=\'%23513F38\'/%3E%3C/svg%3E\") center / cover no-repeat;\n}\n.smilejs-bar-bottom[data-notification-status=\"plain\"] {\n  background-color: #333;\n}\n.smilejs-radio[checked]::after {\n  content: \"\";\n  height: 5px;\n  width:5px;\n  border-radius:50%;\n  background-color: white;\n  position:relative;\n  left:5px;\n  align-globalThis:center;\n}\n.smilejs-card {\n	position: relative;\n	height: 160px;\n	width: 320px;\n	background: #FFF;\n	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);\n	border-radius: 2px;\n	cursor: pointer;\n}\n.smilejs-fab {\n	position: relative;\n	height: 56px;\n	width: 56px;\n	background: #FFF;\n	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);\n	border-radius: 50%;\n	cursor: pointer;\n}\n.smilejs-fab > svg {\n	position: absolute;\n	top: 16px;\n	left: 16px;\n	height: 24px;\n	width: 24px;\n	fill: #757575;\n}\n.smilejs-icon {\n	position: relative;\n	height: 40px;\n	width: 40px;\n	border-radius: 50%;\n	cursor: pointer;\n}\n.smilejs-icon > svg {\n	position: absolute;\n	top: 8px;\n	left: 8px;\n	height: 24px;\n	width: 24px;\n	fill: #757575;\n}\n.smilejs-tooltip {\n  position: relative;\n  display: inline-block;\n}\n\n.smilejs-tooltip .smilejs-tooltiptext {\n  visibility: hidden;\n  width: 120px;\n  background-color: black;\n  color: #fff;\n  text-align: center;\n  border-radius: 6px;\n  padding: 5px 0;\n  position: absolute;\n  z-index: 1;\n  bottom: 150%;\n  left: 50%;\n  margin-left: -60px;\n}\n.smilejs-tooltip .smilejs-tooltiptext {\n  opacity: 0;\n  transition: opacity 1s;\n}\n\n.smilejs-tooltip:hover .smilejs-tooltiptext {\n  opacity: 1;\n}\n.smilejs-tooltip .smilejs-tooltiptext::after {\n  content: \"\";\n  position: absolute;\n  top: 100%;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px;\n  border-style: solid;\n  border-color: black transparent transparent transparent;\n}\n.smilejs-topbar {\n  z-index: 1000000;\n  align-content: center;\n  box-shadow: 0 -1px 20px 0 black;\n  display: block;\n  position: sticky;\n  overflow: scroll;\n  top: 0;\n  width: 100%;\n  height: 80px;\n  background-color: #159957;\n  background-image: linear-gradient(120deg,#155799,#159957);\n}\n.smilejs-tooltip:hover .smilejs-tooltiptext {\n  visibility: visible;\n}\n.smilejs-notify {\n  z-index:1000000000;\n}\n.smilejs-line-ripple::after {\n    text-align: center;\n    transition: transform var(--ripple-transition) cubic-bezier(0, 0, 0.2, 1) 0ms;\n    content:\"\";\n    width:inherit;\n    position:relative;\n    bottom:0;\n    display: flex;\n    align-content:center;\n    border-bottom: var(--ripple-active-color) 2px solid;\n    left:0;\n    right:0;\n    transform:scaleX(0);\n}\n.smilejs-line-ripple::before {\n    border-bottom: var(--ripple-inactive-color) 1px solid;\n    content:\"\";\n    width: inherit;\n    position: relative;\n    bottom: -2px;\n    right: 0;\n    left: 0;\n    display: flex;\n}\n.smilejs-line-ripple-input:focus+.smilejs-line-ripple::after {\n    transform:scaleX(1);\n}\n.smilejs-line-ripple-input {\n    border:0;\n    -webkit-writing-mode: horizontal-tb !important;\n    text-rendering: auto;\n    color: initial;\n    letter-spacing: normal;\n    word-spacing: normal;\n    text-transform: none;\n    text-indent: 0px;\n    text-shadow: none;\n    display: inline-block;\n    text-align: start;\n    -webkit-appearance: textfield;\n    background-color: white;\n    -webkit-rtl-ordering: logical;\n    cursor: text;\n    margin: 0em;\n    height:15px;\n    padding: 1px;\n    width:inherit;\n    resize:none;\n}\n.smilejs-line-ripple-input[disabled] {\n    border:0;\n    -webkit-writing-mode: horizontal-tb !important;\n    text-rendering: auto;\n    color: grey;\n    letter-spacing: normal;\n    word-spacing: normal;\n    text-transform: none;\n    text-indent: 0px;\n    text-shadow: none;\n    display: inline-block;\n    text-align: start;\n    -webkit-appearance: textfield;\n    background-color: white;\n    -webkit-rtl-ordering: logical;\n    cursor: default;\n    margin: 0em;\n    height:15px;\n    padding: 1px;\n    width:inherit;\n    opacity: 0.5;\n}\n.smilejs-line-ripple-input:focus {\n    outline:0;\n}\nbody {\n  --ripple-active-color: #0088FF;\n  --ripple-inactive-color: #7d7d7d;\n  --ripple-transition: 200ms;\n}\n.smilejs-shake {\n  animation: shake 0.5s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes shake {\n  0% { transform: translate(1px, 1px) rotate(0deg); }\n  10% { transform: translate(-1px, -2px) rotate(-1deg); }\n  20% { transform: translate(-3px, 0px) rotate(1deg); }\n  30% { transform: translate(3px, 2px) rotate(0deg); }\n  40% { transform: translate(1px, -1px) rotate(1deg); }\n  50% { transform: translate(-1px, 2px) rotate(-1deg); }\n  60% { transform: translate(-3px, 1px) rotate(0deg); }\n  70% { transform: translate(3px, 1px) rotate(-1deg); }\n  80% { transform: translate(-1px, -1px) rotate(1deg); }\n  90% { transform: translate(1px, 2px) rotate(0deg); }\n  100% { transform: translate(1px, -2px) rotate(-1deg); }\n}\n';
    function loadModule(module1){
        var moduleSrc = moduleCache[module1];
      var module = {exports:{}}
      eval(moduleSrc);
      return module.exports
    };function loadAsset(module1){
        return assets[module1];};
    eval('/*\nBSD 3-Clause License\n\nCopyright (c) 2019, smileycreations15 (me@smileycreations15.com)\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\n3. Neither the name of the copyright holder nor the names of its\n   contributors may be used to endorse or promote products derived from\n   this software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\nloadModule(\"core-main.js\");\n\n//# sourceURL=smileycreations15://smilejs/index.js');
    })();
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.JSEncrypt = {})));
}(this, (function (exports) { 'use strict';

var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) {
    return BI_RM.charAt(n);
}
//#region BIT_OPERATIONS
// (public) this & a
function op_and(x, y) {
    return x & y;
}
// (public) this | a
function op_or(x, y) {
    return x | y;
}
// (public) this ^ a
function op_xor(x, y) {
    return x ^ y;
}
// (public) this & ~a
function op_andnot(x, y) {
    return x & ~y;
}
// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
    if (x == 0) {
        return -1;
    }
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16;
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8;
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4;
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
    }
    if ((x & 1) == 0) {
        ++r;
    }
    return r;
}
// return number of 1 bits in x
function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1;
        ++r;
    }
    return r;
}
//#endregion BIT_OPERATIONS

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}
// convert a base64 string to hex
function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) {
            break;
        }
        var v = b64map.indexOf(s.charAt(i));
        if (v < 0) {
            continue;
        }
        if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) {
        ret += int2char(slop << 2);
    }
    return ret;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

// Hex JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder;
var Hex = {
    decode: function (a) {
        var i;
        if (decoder === undefined) {
            var hex = "0123456789ABCDEF";
            var ignore = " \f\n\r\t\u00A0\u2028\u2029";
            decoder = {};
            for (i = 0; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            hex = hex.toLowerCase();
            for (i = 10; i < 16; ++i) {
                decoder[hex.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
                decoder[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 2) {
                out[out.length] = bits;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 4;
            }
        }
        if (char_count) {
            throw new Error("Hex encoding incomplete: 4 bits missing");
        }
        return out;
    }
};

// Base64 JavaScript decoder
// Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var decoder$1;
var Base64 = {
    decode: function (a) {
        var i;
        if (decoder$1 === undefined) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var ignore = "= \f\n\r\t\u00A0\u2028\u2029";
            decoder$1 = Object.create(null);
            for (i = 0; i < 64; ++i) {
                decoder$1[b64.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
                decoder$1[ignore.charAt(i)] = -1;
            }
        }
        var out = [];
        var bits = 0;
        var char_count = 0;
        for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
                break;
            }
            c = decoder$1[c];
            if (c == -1) {
                continue;
            }
            if (c === undefined) {
                throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 4) {
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                out[out.length] = bits & 0xFF;
                bits = 0;
                char_count = 0;
            }
            else {
                bits <<= 6;
            }
        }
        switch (char_count) {
            case 1:
                throw new Error("Base64 encoding incomplete: at least 2 bits missing");
            case 2:
                out[out.length] = (bits >> 10);
                break;
            case 3:
                out[out.length] = (bits >> 16);
                out[out.length] = (bits >> 8) & 0xFF;
                break;
        }
        return out;
    },
    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
    unarmor: function (a) {
        var m = Base64.re.exec(a);
        if (m) {
            if (m[1]) {
                a = m[1];
            }
            else if (m[2]) {
                a = m[2];
            }
            else {
                throw new Error("RegExp out of sync");
            }
        }
        return Base64.decode(a);
    }
};

// Big integer base-10 printing library
// Copyright (c) 2014 Lapo Luchini <lapo@lapo.it>
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
var max = 10000000000000; // biggest integer that can still fit 2^53 when multiplied by 256
var Int10 = /** @class */ (function () {
    function Int10(value) {
        this.buf = [+value || 0];
    }
    Int10.prototype.mulAdd = function (m, c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] * m + c;
            if (t < max) {
                c = 0;
            }
            else {
                c = 0 | (t / max);
                t -= c * max;
            }
            b[i] = t;
        }
        if (c > 0) {
            b[i] = c;
        }
    };
    Int10.prototype.sub = function (c) {
        // assert(m <= 256)
        var b = this.buf;
        var l = b.length;
        var i;
        var t;
        for (i = 0; i < l; ++i) {
            t = b[i] - c;
            if (t < 0) {
                t += max;
                c = 1;
            }
            else {
                c = 0;
            }
            b[i] = t;
        }
        while (b[b.length - 1] === 0) {
            b.pop();
        }
    };
    Int10.prototype.toString = function (base) {
        if ((base || 10) != 10) {
            throw new Error("only base 10 is supported");
        }
        var b = this.buf;
        var s = b[b.length - 1].toString();
        for (var i = b.length - 2; i >= 0; --i) {
            s += (max + b[i]).toString().substring(1);
        }
        return s;
    };
    Int10.prototype.valueOf = function () {
        var b = this.buf;
        var v = 0;
        for (var i = b.length - 1; i >= 0; --i) {
            v = v * max + b[i];
        }
        return v;
    };
    Int10.prototype.simplify = function () {
        var b = this.buf;
        return (b.length == 1) ? b[0] : this;
    };
    return Int10;
}());

// ASN.1 JavaScript decoder
var ellipsis = "\u2026";
var reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
var reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
function stringCut(str, len) {
    if (str.length > len) {
        str = str.substring(0, len) + ellipsis;
    }
    return str;
}
var Stream = /** @class */ (function () {
    function Stream(enc, pos) {
        this.hexDigits = "0123456789ABCDEF";
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        }
        else {
            // enc should be an array or a binary string
            this.enc = enc;
            this.pos = pos;
        }
    }
    Stream.prototype.get = function (pos) {
        if (pos === undefined) {
            pos = this.pos++;
        }
        if (pos >= this.enc.length) {
            throw new Error("Requesting byte offset " + pos + " on a stream of length " + this.enc.length);
        }
        return ("string" === typeof this.enc) ? this.enc.charCodeAt(pos) : this.enc[pos];
    };
    Stream.prototype.hexByte = function (b) {
        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
    };
    Stream.prototype.hexDump = function (start, end, raw) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            if (raw !== true) {
                switch (i & 0xF) {
                    case 0x7:
                        s += "  ";
                        break;
                    case 0xF:
                        s += "\n";
                        break;
                    default:
                        s += " ";
                }
            }
        }
        return s;
    };
    Stream.prototype.isASCII = function (start, end) {
        for (var i = start; i < end; ++i) {
            var c = this.get(i);
            if (c < 32 || c > 176) {
                return false;
            }
        }
        return true;
    };
    Stream.prototype.parseStringISO = function (start, end) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += String.fromCharCode(this.get(i));
        }
        return s;
    };
    Stream.prototype.parseStringUTF = function (start, end) {
        var s = "";
        for (var i = start; i < end;) {
            var c = this.get(i++);
            if (c < 128) {
                s += String.fromCharCode(c);
            }
            else if ((c > 191) && (c < 224)) {
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            }
            else {
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
            }
        }
        return s;
    };
    Stream.prototype.parseStringBMP = function (start, end) {
        var str = "";
        var hi;
        var lo;
        for (var i = start; i < end;) {
            hi = this.get(i++);
            lo = this.get(i++);
            str += String.fromCharCode((hi << 8) | lo);
        }
        return str;
    };
    Stream.prototype.parseTime = function (start, end, shortYear) {
        var s = this.parseStringISO(start, end);
        var m = (shortYear ? reTimeS : reTimeL).exec(s);
        if (!m) {
            return "Unrecognized time: " + s;
        }
        if (shortYear) {
            // to avoid querying the timer, use the fixed range [1970, 2069]
            // it will conform with ITU X.400 [-10, +40] sliding globalThis until 2030
            m[1] = +m[1];
            m[1] += (+m[1] < 70) ? 2000 : 1900;
        }
        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
        if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
                s += ":" + m[6];
                if (m[7]) {
                    s += "." + m[7];
                }
            }
        }
        if (m[8]) {
            s += " UTC";
            if (m[8] != "Z") {
                s += m[8];
                if (m[9]) {
                    s += ":" + m[9];
                }
            }
        }
        return s;
    };
    Stream.prototype.parseInteger = function (start, end) {
        var v = this.get(start);
        var neg = (v > 127);
        var pad = neg ? 255 : 0;
        var len;
        var s = "";
        // skip unuseful bits (not allowed in DER)
        while (v == pad && ++start < end) {
            v = this.get(start);
        }
        len = end - start;
        if (len === 0) {
            return neg ? -1 : 0;
        }
        // show bit length of huge integers
        if (len > 4) {
            s = v;
            len <<= 3;
            while (((+s ^ pad) & 0x80) == 0) {
                s = +s << 1;
                --len;
            }
            s = "(" + len + " bit)\n";
        }
        // decode the integer
        if (neg) {
            v = v - 256;
        }
        var n = new Int10(v);
        for (var i = start + 1; i < end; ++i) {
            n.mulAdd(256, this.get(i));
        }
        return s + n.toString();
    };
    Stream.prototype.parseBitString = function (start, end, maxLength) {
        var unusedBit = this.get(start);
        var lenBit = ((end - start - 1) << 3) - unusedBit;
        var intro = "(" + lenBit + " bit)\n";
        var s = "";
        for (var i = start + 1; i < end; ++i) {
            var b = this.get(i);
            var skip = (i == end - 1) ? unusedBit : 0;
            for (var j = 7; j >= skip; --j) {
                s += (b >> j) & 1 ? "1" : "0";
            }
            if (s.length > maxLength) {
                return intro + stringCut(s, maxLength);
            }
        }
        return intro + s;
    };
    Stream.prototype.parseOctetString = function (start, end, maxLength) {
        if (this.isASCII(start, end)) {
            return stringCut(this.parseStringISO(start, end), maxLength);
        }
        var len = end - start;
        var s = "(" + len + " byte)\n";
        maxLength /= 2; // we work in bytes
        if (len > maxLength) {
            end = start + maxLength;
        }
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
        }
        if (len > maxLength) {
            s += ellipsis;
        }
        return s;
    };
    Stream.prototype.parseOID = function (start, end, maxLength) {
        var s = "";
        var n = new Int10();
        var bits = 0;
        for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n.mulAdd(128, v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) { // finished
                if (s === "") {
                    n = n.simplify();
                    if (n instanceof Int10) {
                        n.sub(80);
                        s = "2." + n.toString();
                    }
                    else {
                        var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                        s = m + "." + (n - m * 40);
                    }
                }
                else {
                    s += "." + n.toString();
                }
                if (s.length > maxLength) {
                    return stringCut(s, maxLength);
                }
                n = new Int10();
                bits = 0;
            }
        }
        if (bits > 0) {
            s += ".incomplete";
        }
        return s;
    };
    return Stream;
}());
var ASN1 = /** @class */ (function () {
    function ASN1(stream, header, length, tag, sub) {
        if (!(tag instanceof ASN1Tag)) {
            throw new Error("Invalid tag value.");
        }
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }
    ASN1.prototype.typeName = function () {
        switch (this.tag.tagClass) {
            case 0: // universal
                switch (this.tag.tagNumber) {
                    case 0x00:
                        return "EOC";
                    case 0x01:
                        return "BOOLEAN";
                    case 0x02:
                        return "INTEGER";
                    case 0x03:
                        return "BIT_STRING";
                    case 0x04:
                        return "OCTET_STRING";
                    case 0x05:
                        return "NULL";
                    case 0x06:
                        return "OBJECT_IDENTIFIER";
                    case 0x07:
                        return "ObjectDescriptor";
                    case 0x08:
                        return "EXTERNAL";
                    case 0x09:
                        return "REAL";
                    case 0x0A:
                        return "ENUMERATED";
                    case 0x0B:
                        return "EMBEDDED_PDV";
                    case 0x0C:
                        return "UTF8String";
                    case 0x10:
                        return "SEQUENCE";
                    case 0x11:
                        return "SET";
                    case 0x12:
                        return "NumericString";
                    case 0x13:
                        return "PrintableString"; // ASCII subset
                    case 0x14:
                        return "TeletexString"; // aka T61String
                    case 0x15:
                        return "VideotexString";
                    case 0x16:
                        return "IA5String"; // ASCII
                    case 0x17:
                        return "UTCTime";
                    case 0x18:
                        return "GeneralizedTime";
                    case 0x19:
                        return "GraphicString";
                    case 0x1A:
                        return "VisibleString"; // ASCII subset
                    case 0x1B:
                        return "GeneralString";
                    case 0x1C:
                        return "UniversalString";
                    case 0x1E:
                        return "BMPString";
                }
                return "Universal_" + this.tag.tagNumber.toString();
            case 1:
                return "Application_" + this.tag.tagNumber.toString();
            case 2:
                return "[" + this.tag.tagNumber.toString() + "]"; // Context
            case 3:
                return "Private_" + this.tag.tagNumber.toString();
        }
    };
    ASN1.prototype.content = function (maxLength) {
        if (this.tag === undefined) {
            return null;
        }
        if (maxLength === undefined) {
            maxLength = Infinity;
        }
        var content = this.posContent();
        var len = Math.abs(this.length);
        if (!this.tag.isUniversal()) {
            if (this.sub !== null) {
                return "(" + this.sub.length + " elem)";
            }
            return this.stream.parseOctetString(content, content + len, maxLength);
        }
        switch (this.tag.tagNumber) {
            case 0x01: // BOOLEAN
                return (this.stream.get(content) === 0) ? "false" : "true";
            case 0x02: // INTEGER
                return this.stream.parseInteger(content, content + len);
            case 0x03: // BIT_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseBitString(content, content + len, maxLength);
            case 0x04: // OCTET_STRING
                return this.sub ? "(" + this.sub.length + " elem)" :
                    this.stream.parseOctetString(content, content + len, maxLength);
            // case 0x05: // NULL
            case 0x06: // OBJECT_IDENTIFIER
                return this.stream.parseOID(content, content + len, maxLength);
            // case 0x07: // ObjectDescriptor
            // case 0x08: // EXTERNAL
            // case 0x09: // REAL
            // case 0x0A: // ENUMERATED
            // case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11: // SET
                if (this.sub !== null) {
                    return "(" + this.sub.length + " elem)";
                }
                else {
                    return "(no elem)";
                }
            case 0x0C: // UTF8String
                return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            // case 0x19: // GraphicString
            case 0x1A: // VisibleString
                // case 0x1B: // GeneralString
                // case 0x1C: // UniversalString
                return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
            case 0x1E: // BMPString
                return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
            case 0x17: // UTCTime
            case 0x18: // GeneralizedTime
                return this.stream.parseTime(content, content + len, (this.tag.tagNumber == 0x17));
        }
        return null;
    };
    ASN1.prototype.toString = function () {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub === null) ? "null" : this.sub.length) + "]";
    };
    ASN1.prototype.toPrettyString = function (indent) {
        if (indent === undefined) {
            indent = "";
        }
        var s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0) {
            s += "+";
        }
        s += this.length;
        if (this.tag.tagConstructed) {
            s += " (constructed)";
        }
        else if ((this.tag.isUniversal() && ((this.tag.tagNumber == 0x03) || (this.tag.tagNumber == 0x04))) && (this.sub !== null)) {
            s += " (encapsulates)";
        }
        s += "\n";
        if (this.sub !== null) {
            indent += "  ";
            for (var i = 0, max = this.sub.length; i < max; ++i) {
                s += this.sub[i].toPrettyString(indent);
            }
        }
        return s;
    };
    ASN1.prototype.posStart = function () {
        return this.stream.pos;
    };
    ASN1.prototype.posContent = function () {
        return this.stream.pos + this.header;
    };
    ASN1.prototype.posEnd = function () {
        return this.stream.pos + this.header + Math.abs(this.length);
    };
    ASN1.prototype.toHexString = function () {
        return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    };
    ASN1.decodeLength = function (stream) {
        var buf = stream.get();
        var len = buf & 0x7F;
        if (len == buf) {
            return len;
        }
        // no reason to use Int10, as it would be a huge buffer anyways
        if (len > 6) {
            throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
        }
        if (len === 0) {
            return null;
        } // undefined
        buf = 0;
        for (var i = 0; i < len; ++i) {
            buf = (buf * 256) + stream.get();
        }
        return buf;
    };
    /**
     * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
     * @returns {string}
     * @public
     */
    ASN1.prototype.getHexStringValue = function () {
        var hexString = this.toHexString();
        var offset = this.header * 2;
        var length = this.length * 2;
        return hexString.substr(offset, length);
    };
    ASN1.decode = function (str) {
        var stream;
        if (!(str instanceof Stream)) {
            stream = new Stream(str, 0);
        }
        else {
            stream = str;
        }
        var streamStart = new Stream(stream);
        var tag = new ASN1Tag(stream);
        var len = ASN1.decodeLength(stream);
        var start = stream.pos;
        var header = start - streamStart.pos;
        var sub = null;
        var getSub = function () {
            var ret = [];
            if (len !== null) {
                // definite length
                var end = start + len;
                while (stream.pos < end) {
                    ret[ret.length] = ASN1.decode(stream);
                }
                if (stream.pos != end) {
                    throw new Error("Content size is not correct for container starting at offset " + start);
                }
            }
            else {
                // undefined length
                try {
                    for (;;) {
                        var s = ASN1.decode(stream);
                        if (s.tag.isEOC()) {
                            break;
                        }
                        ret[ret.length] = s;
                    }
                    len = start - stream.pos; // undefined lengths are represented as negative values
                }
                catch (e) {
                    throw new Error("Exception while decoding undefined length content: " + e);
                }
            }
            return ret;
        };
        if (tag.tagConstructed) {
            // must have valid content
            sub = getSub();
        }
        else if (tag.isUniversal() && ((tag.tagNumber == 0x03) || (tag.tagNumber == 0x04))) {
            // sometimes BitString and OctetString are used to encapsulate ASN.1
            try {
                if (tag.tagNumber == 0x03) {
                    if (stream.get() != 0) {
                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    }
                }
                sub = getSub();
                for (var i = 0; i < sub.length; ++i) {
                    if (sub[i].tag.isEOC()) {
                        throw new Error("EOC is not supposed to be actual content.");
                    }
                }
            }
            catch (e) {
                // but silently ignore when they don't
                sub = null;
            }
        }
        if (sub === null) {
            if (len === null) {
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
            }
            stream.pos = start + Math.abs(len);
        }
        return new ASN1(streamStart, header, len, tag, sub);
    };
    return ASN1;
}());
var ASN1Tag = /** @class */ (function () {
    function ASN1Tag(stream) {
        var buf = stream.get();
        this.tagClass = buf >> 6;
        this.tagConstructed = ((buf & 0x20) !== 0);
        this.tagNumber = buf & 0x1F;
        if (this.tagNumber == 0x1F) { // long tag
            var n = new Int10();
            do {
                buf = stream.get();
                n.mulAdd(128, buf & 0x7F);
            } while (buf & 0x80);
            this.tagNumber = n.simplify();
        }
    }
    ASN1Tag.prototype.isUniversal = function () {
        return this.tagClass === 0x00;
    };
    ASN1Tag.prototype.isEOC = function () {
        return this.tagClass === 0x00 && this.tagNumber === 0x00;
    };
    return ASN1Tag;
}());

// Copyright (c) 2005  Tom Wu
// Bits per digit
var dbits;
// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);
//#region
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
//#endregion
// (public) Constructor
var BigInteger = /** @class */ (function () {
    function BigInteger(a, b, c) {
        if (a != null) {
            if ("number" == typeof a) {
                this.fromNumber(a, b, c);
            }
            else if (b == null && "string" != typeof a) {
                this.fromString(a, 256);
            }
            else {
                this.fromString(a, b);
            }
        }
    }
    //#region PUBLIC
    // BigInteger.prototype.toString = bnToString;
    // (public) return string representation in given radix
    BigInteger.prototype.toString = function (b) {
        if (this.s < 0) {
            return "-" + this.negate().toString(b);
        }
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            return this.toRadix(b);
        }
        var km = (1 << k) - 1;
        var d;
        var m = false;
        var r = "";
        var i = this.t;
        var p = this.DB - (i * this.DB) % k;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = int2char(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & ((1 << p) - 1)) << (k - p);
                    d |= this[--i] >> (p += this.DB - k);
                }
                else {
                    d = (this[i] >> (p -= k)) & km;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if (d > 0) {
                    m = true;
                }
                if (m) {
                    r += int2char(d);
                }
            }
        }
        return m ? r : "0";
    };
    // BigInteger.prototype.negate = bnNegate;
    // (public) -this
    BigInteger.prototype.negate = function () {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    };
    // BigInteger.prototype.abs = bnAbs;
    // (public) |this|
    BigInteger.prototype.abs = function () {
        return (this.s < 0) ? this.negate() : this;
    };
    // BigInteger.prototype.compareTo = bnCompareTo;
    // (public) return + if this > a, - if this < a, 0 if equal
    BigInteger.prototype.compareTo = function (a) {
        var r = this.s - a.s;
        if (r != 0) {
            return r;
        }
        var i = this.t;
        r = i - a.t;
        if (r != 0) {
            return (this.s < 0) ? -r : r;
        }
        while (--i >= 0) {
            if ((r = this[i] - a[i]) != 0) {
                return r;
            }
        }
        return 0;
    };
    // BigInteger.prototype.bitLength = bnBitLength;
    // (public) return the number of bits in "this"
    BigInteger.prototype.bitLength = function () {
        if (this.t <= 0) {
            return 0;
        }
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
    };
    // BigInteger.prototype.mod = bnMod;
    // (public) this mod a
    BigInteger.prototype.mod = function (a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            a.subTo(r, r);
        }
        return r;
    };
    // BigInteger.prototype.modPowInt = bnModPowInt;
    // (public) this^e % m, 0 <= e < 2^32
    BigInteger.prototype.modPowInt = function (e, m) {
        var z;
        if (e < 256 || m.isEven()) {
            z = new Classic(m);
        }
        else {
            z = new Montgomery(m);
        }
        return this.exp(e, z);
    };
    // BigInteger.prototype.clone = bnClone;
    // (public)
    BigInteger.prototype.clone = function () {
        var r = nbi();
        this.copyTo(r);
        return r;
    };
    // BigInteger.prototype.intValue = bnIntValue;
    // (public) return value as integer
    BigInteger.prototype.intValue = function () {
        if (this.s < 0) {
            if (this.t == 1) {
                return this[0] - this.DV;
            }
            else if (this.t == 0) {
                return -1;
            }
        }
        else if (this.t == 1) {
            return this[0];
        }
        else if (this.t == 0) {
            return 0;
        }
        // assumes 16 < DB < 32
        return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
    };
    // BigInteger.prototype.byteValue = bnByteValue;
    // (public) return value as byte
    BigInteger.prototype.byteValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
    };
    // BigInteger.prototype.shortValue = bnShortValue;
    // (public) return value as short (assumes DB>=16)
    BigInteger.prototype.shortValue = function () {
        return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
    };
    // BigInteger.prototype.signum = bnSigNum;
    // (public) 0 if this == 0, 1 if this > 0
    BigInteger.prototype.signum = function () {
        if (this.s < 0) {
            return -1;
        }
        else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
            return 0;
        }
        else {
            return 1;
        }
    };
    // BigInteger.prototype.toByteArray = bnToByteArray;
    // (public) convert to bigendian byte array
    BigInteger.prototype.toByteArray = function () {
        var i = this.t;
        var r = [];
        r[0] = this.s;
        var p = this.DB - (i * this.DB) % 8;
        var d;
        var k = 0;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
                r[k++] = d | (this.s << (this.DB - p));
            }
            while (i >= 0) {
                if (p < 8) {
                    d = (this[i] & ((1 << p) - 1)) << (8 - p);
                    d |= this[--i] >> (p += this.DB - 8);
                }
                else {
                    d = (this[i] >> (p -= 8)) & 0xff;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if ((d & 0x80) != 0) {
                    d |= -256;
                }
                if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                    ++k;
                }
                if (k > 0 || d != this.s) {
                    r[k++] = d;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.equals = function (a) {
        return (this.compareTo(a) == 0);
    };
    // BigInteger.prototype.min = bnMin;
    BigInteger.prototype.min = function (a) {
        return (this.compareTo(a) < 0) ? this : a;
    };
    // BigInteger.prototype.max = bnMax;
    BigInteger.prototype.max = function (a) {
        return (this.compareTo(a) > 0) ? this : a;
    };
    // BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.and = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_and, r);
        return r;
    };
    // BigInteger.prototype.or = bnOr;
    BigInteger.prototype.or = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_or, r);
        return r;
    };
    // BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.xor = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_xor, r);
        return r;
    };
    // BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.andNot = function (a) {
        var r = nbi();
        this.bitwiseTo(a, op_andnot, r);
        return r;
    };
    // BigInteger.prototype.not = bnNot;
    // (public) ~this
    BigInteger.prototype.not = function () {
        var r = nbi();
        for (var i = 0; i < this.t; ++i) {
            r[i] = this.DM & ~this[i];
        }
        r.t = this.t;
        r.s = ~this.s;
        return r;
    };
    // BigInteger.prototype.shiftLeft = bnShiftLeft;
    // (public) this << n
    BigInteger.prototype.shiftLeft = function (n) {
        var r = nbi();
        if (n < 0) {
            this.rShiftTo(-n, r);
        }
        else {
            this.lShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.shiftRight = bnShiftRight;
    // (public) this >> n
    BigInteger.prototype.shiftRight = function (n) {
        var r = nbi();
        if (n < 0) {
            this.lShiftTo(-n, r);
        }
        else {
            this.rShiftTo(n, r);
        }
        return r;
    };
    // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    // (public) returns index of lowest 1-bit (or -1 if none)
    BigInteger.prototype.getLowestSetBit = function () {
        for (var i = 0; i < this.t; ++i) {
            if (this[i] != 0) {
                return i * this.DB + lbit(this[i]);
            }
        }
        if (this.s < 0) {
            return this.t * this.DB;
        }
        return -1;
    };
    // BigInteger.prototype.bitCount = bnBitCount;
    // (public) return number of set bits
    BigInteger.prototype.bitCount = function () {
        var r = 0;
        var x = this.s & this.DM;
        for (var i = 0; i < this.t; ++i) {
            r += cbit(this[i] ^ x);
        }
        return r;
    };
    // BigInteger.prototype.testBit = bnTestBit;
    // (public) true iff nth bit is set
    BigInteger.prototype.testBit = function (n) {
        var j = Math.floor(n / this.DB);
        if (j >= this.t) {
            return (this.s != 0);
        }
        return ((this[j] & (1 << (n % this.DB))) != 0);
    };
    // BigInteger.prototype.setBit = bnSetBit;
    // (public) this | (1<<n)
    BigInteger.prototype.setBit = function (n) {
        return this.changeBit(n, op_or);
    };
    // BigInteger.prototype.clearBit = bnClearBit;
    // (public) this & ~(1<<n)
    BigInteger.prototype.clearBit = function (n) {
        return this.changeBit(n, op_andnot);
    };
    // BigInteger.prototype.flipBit = bnFlipBit;
    // (public) this ^ (1<<n)
    BigInteger.prototype.flipBit = function (n) {
        return this.changeBit(n, op_xor);
    };
    // BigInteger.prototype.add = bnAdd;
    // (public) this + a
    BigInteger.prototype.add = function (a) {
        var r = nbi();
        this.addTo(a, r);
        return r;
    };
    // BigInteger.prototype.subtract = bnSubtract;
    // (public) this - a
    BigInteger.prototype.subtract = function (a) {
        var r = nbi();
        this.subTo(a, r);
        return r;
    };
    // BigInteger.prototype.multiply = bnMultiply;
    // (public) this * a
    BigInteger.prototype.multiply = function (a) {
        var r = nbi();
        this.multiplyTo(a, r);
        return r;
    };
    // BigInteger.prototype.divide = bnDivide;
    // (public) this / a
    BigInteger.prototype.divide = function (a) {
        var r = nbi();
        this.divRemTo(a, r, null);
        return r;
    };
    // BigInteger.prototype.remainder = bnRemainder;
    // (public) this % a
    BigInteger.prototype.remainder = function (a) {
        var r = nbi();
        this.divRemTo(a, null, r);
        return r;
    };
    // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    // (public) [this/a,this%a]
    BigInteger.prototype.divideAndRemainder = function (a) {
        var q = nbi();
        var r = nbi();
        this.divRemTo(a, q, r);
        return [q, r];
    };
    // BigInteger.prototype.modPow = bnModPow;
    // (public) this^e % m (HAC 14.85)
    BigInteger.prototype.modPow = function (e, m) {
        var i = e.bitLength();
        var k;
        var r = nbv(1);
        var z;
        if (i <= 0) {
            return r;
        }
        else if (i < 18) {
            k = 1;
        }
        else if (i < 48) {
            k = 3;
        }
        else if (i < 144) {
            k = 4;
        }
        else if (i < 768) {
            k = 5;
        }
        else {
            k = 6;
        }
        if (i < 8) {
            z = new Classic(m);
        }
        else if (m.isEven()) {
            z = new Barrett(m);
        }
        else {
            z = new Montgomery(m);
        }
        // precomputation
        var g = [];
        var n = 3;
        var k1 = k - 1;
        var km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
                g[n] = nbi();
                z.mulTo(g2, g[n - 2], g[n]);
                n += 2;
            }
        }
        var j = e.t - 1;
        var w;
        var is1 = true;
        var r2 = nbi();
        var t;
        i = nbits(e[j]) - 1;
        while (j >= 0) {
            if (i >= k1) {
                w = (e[j] >> (i - k1)) & km;
            }
            else {
                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                if (j > 0) {
                    w |= e[j - 1] >> (this.DB + i - k1);
                }
            }
            n = k;
            while ((w & 1) == 0) {
                w >>= 1;
                --n;
            }
            if ((i -= n) < 0) {
                i += this.DB;
                --j;
            }
            if (is1) { // ret == 1, don't bother squaring or multiplying it
                g[w].copyTo(r);
                is1 = false;
            }
            else {
                while (n > 1) {
                    z.sqrTo(r, r2);
                    z.sqrTo(r2, r);
                    n -= 2;
                }
                if (n > 0) {
                    z.sqrTo(r, r2);
                }
                else {
                    t = r;
                    r = r2;
                    r2 = t;
                }
                z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & (1 << i)) == 0) {
                z.sqrTo(r, r2);
                t = r;
                r = r2;
                r2 = t;
                if (--i < 0) {
                    i = this.DB - 1;
                    --j;
                }
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.modInverse = bnModInverse;
    // (public) 1/this % m (HAC 14.61)
    BigInteger.prototype.modInverse = function (m) {
        var ac = m.isEven();
        if ((this.isEven() && ac) || m.signum() == 0) {
            return BigInteger.ZERO;
        }
        var u = m.clone();
        var v = this.clone();
        var a = nbv(1);
        var b = nbv(0);
        var c = nbv(0);
        var d = nbv(1);
        while (u.signum() != 0) {
            while (u.isEven()) {
                u.rShiftTo(1, u);
                if (ac) {
                    if (!a.isEven() || !b.isEven()) {
                        a.addTo(this, a);
                        b.subTo(m, b);
                    }
                    a.rShiftTo(1, a);
                }
                else if (!b.isEven()) {
                    b.subTo(m, b);
                }
                b.rShiftTo(1, b);
            }
            while (v.isEven()) {
                v.rShiftTo(1, v);
                if (ac) {
                    if (!c.isEven() || !d.isEven()) {
                        c.addTo(this, c);
                        d.subTo(m, d);
                    }
                    c.rShiftTo(1, c);
                }
                else if (!d.isEven()) {
                    d.subTo(m, d);
                }
                d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac) {
                    a.subTo(c, a);
                }
                b.subTo(d, b);
            }
            else {
                v.subTo(u, v);
                if (ac) {
                    c.subTo(a, c);
                }
                d.subTo(b, d);
            }
        }
        if (v.compareTo(BigInteger.ONE) != 0) {
            return BigInteger.ZERO;
        }
        if (d.compareTo(m) >= 0) {
            return d.subtract(m);
        }
        if (d.signum() < 0) {
            d.addTo(m, d);
        }
        else {
            return d;
        }
        if (d.signum() < 0) {
            return d.add(m);
        }
        else {
            return d;
        }
    };
    // BigInteger.prototype.pow = bnPow;
    // (public) this^e
    BigInteger.prototype.pow = function (e) {
        return this.exp(e, new NullExp());
    };
    // BigInteger.prototype.gcd = bnGCD;
    // (public) gcd(this,a) (HAC 14.54)
    BigInteger.prototype.gcd = function (a) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            return x;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
        }
        if (g > 0) {
            y.lShiftTo(g, y);
        }
        return y;
    };
    // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    // (public) test primality with certainty >= 1-.5^t
    BigInteger.prototype.isProbablePrime = function (t) {
        var i;
        var x = this.abs();
        if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i) {
                if (x[0] == lowprimes[i]) {
                    return true;
                }
            }
            return false;
        }
        if (x.isEven()) {
            return false;
        }
        i = 1;
        while (i < lowprimes.length) {
            var m = lowprimes[i];
            var j = i + 1;
            while (j < lowprimes.length && m < lplim) {
                m *= lowprimes[j++];
            }
            m = x.modInt(m);
            while (i < j) {
                if (m % lowprimes[i++] == 0) {
                    return false;
                }
            }
        }
        return x.millerRabin(t);
    };
    //#endregion PUBLIC
    //#region PROTECTED
    // BigInteger.prototype.copyTo = bnpCopyTo;
    // (protected) copy this to r
    BigInteger.prototype.copyTo = function (r) {
        for (var i = this.t - 1; i >= 0; --i) {
            r[i] = this[i];
        }
        r.t = this.t;
        r.s = this.s;
    };
    // BigInteger.prototype.fromInt = bnpFromInt;
    // (protected) set from integer value x, -DV <= x < DV
    BigInteger.prototype.fromInt = function (x) {
        this.t = 1;
        this.s = (x < 0) ? -1 : 0;
        if (x > 0) {
            this[0] = x;
        }
        else if (x < -1) {
            this[0] = x + this.DV;
        }
        else {
            this.t = 0;
        }
    };
    // BigInteger.prototype.fromString = bnpFromString;
    // (protected) set from string and radix
    BigInteger.prototype.fromString = function (s, b) {
        var k;
        if (b == 16) {
            k = 4;
        }
        else if (b == 8) {
            k = 3;
        }
        else if (b == 256) {
            k = 8;
            /* byte array */
        }
        else if (b == 2) {
            k = 1;
        }
        else if (b == 32) {
            k = 5;
        }
        else if (b == 4) {
            k = 2;
        }
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length;
        var mi = false;
        var sh = 0;
        while (--i >= 0) {
            var x = (k == 8) ? (+s[i]) & 0xff : intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-") {
                    mi = true;
                }
                continue;
            }
            mi = false;
            if (sh == 0) {
                this[this.t++] = x;
            }
            else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                this[this.t++] = (x >> (this.DB - sh));
            }
            else {
                this[this.t - 1] |= x << sh;
            }
            sh += k;
            if (sh >= this.DB) {
                sh -= this.DB;
            }
        }
        if (k == 8 && ((+s[0]) & 0x80) != 0) {
            this.s = -1;
            if (sh > 0) {
                this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
            }
        }
        this.clamp();
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.clamp = bnpClamp;
    // (protected) clamp off excess high words
    BigInteger.prototype.clamp = function () {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c) {
            --this.t;
        }
    };
    // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    // (protected) r = this << n*DB
    BigInteger.prototype.dlShiftTo = function (n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + n] = this[i];
        }
        for (i = n - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r.t = this.t + n;
        r.s = this.s;
    };
    // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    // (protected) r = this >> n*DB
    BigInteger.prototype.drShiftTo = function (n, r) {
        for (var i = n; i < this.t; ++i) {
            r[i - n] = this[i];
        }
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    };
    // BigInteger.prototype.lShiftTo = bnpLShiftTo;
    // (protected) r = this << n
    BigInteger.prototype.lShiftTo = function (n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB);
        var c = (this.s << bs) & this.DM;
        for (var i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
        }
        for (var i = ds - 1; i >= 0; --i) {
            r[i] = 0;
        }
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    };
    // BigInteger.prototype.rShiftTo = bnpRShiftTo;
    // (protected) r = this >> n
    BigInteger.prototype.rShiftTo = function (n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0) {
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
        }
        r.t = this.t - ds;
        r.clamp();
    };
    // BigInteger.prototype.subTo = bnpSubTo;
    // (protected) r = this - a
    BigInteger.prototype.subTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c < -1) {
            r[i++] = this.DV + c;
        }
        else if (c > 0) {
            r[i++] = c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyTo = function (a, r) {
        var x = this.abs();
        var y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < y.t; ++i) {
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        }
        r.s = 0;
        r.clamp();
        if (this.s != a.s) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.squareTo = bnpSquareTo;
    // (protected) r = this^2, r != this (HAC 14.16)
    BigInteger.prototype.squareTo = function (r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0) {
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        }
        r.s = 0;
        r.clamp();
    };
    // BigInteger.prototype.divRemTo = bnpDivRemTo;
    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    BigInteger.prototype.divRemTo = function (m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) {
            return;
        }
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null) {
                q.fromInt(0);
            }
            if (r != null) {
                this.copyTo(r);
            }
            return;
        }
        if (r == null) {
            r = nbi();
        }
        var y = nbi();
        var ts = this.s;
        var ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        }
        else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0) {
            return;
        }
        var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt;
        var d2 = (1 << this.F1) / yt;
        var e = 1 << this.F2;
        var i = r.t;
        var j = i - ys;
        var t = (q == null) ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y); // "negative" y so we can replace sub with am later
        while (y.t < ys) {
            y[y.t++] = 0;
        }
        while (--j >= 0) {
            // Estimate quotient digit
            var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) {
                    r.subTo(t, r);
                }
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) {
                BigInteger.ZERO.subTo(q, q);
            }
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) {
            r.rShiftTo(nsh, r);
        } // Denormalize remainder
        if (ts < 0) {
            BigInteger.ZERO.subTo(r, r);
        }
    };
    // BigInteger.prototype.invDigit = bnpInvDigit;
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    BigInteger.prototype.invDigit = function () {
        if (this.t < 1) {
            return 0;
        }
        var x = this[0];
        if ((x & 1) == 0) {
            return 0;
        }
        var y = x & 3; // y == 1/x mod 2^2
        y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
        y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
        y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return (y > 0) ? this.DV - y : -y;
    };
    // BigInteger.prototype.isEven = bnpIsEven;
    // (protected) true iff this is even
    BigInteger.prototype.isEven = function () {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
    };
    // BigInteger.prototype.exp = bnpExp;
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    BigInteger.prototype.exp = function (e, z) {
        if (e > 0xffffffff || e < 1) {
            return BigInteger.ONE;
        }
        var r = nbi();
        var r2 = nbi();
        var g = z.convert(this);
        var i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0) {
                z.mulTo(r2, g, r);
            }
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    };
    // BigInteger.prototype.chunkSize = bnpChunkSize;
    // (protected) return x s.t. r^x < DV
    BigInteger.prototype.chunkSize = function (r) {
        return Math.floor(Math.LN2 * this.DB / Math.log(r));
    };
    // BigInteger.prototype.toRadix = bnpToRadix;
    // (protected) convert to radix string
    BigInteger.prototype.toRadix = function (b) {
        if (b == null) {
            b = 10;
        }
        if (this.signum() == 0 || b < 2 || b > 36) {
            return "0";
        }
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = nbv(a);
        var y = nbi();
        var z = nbi();
        var r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
    };
    // BigInteger.prototype.fromRadix = bnpFromRadix;
    // (protected) convert from radix string
    BigInteger.prototype.fromRadix = function (s, b) {
        this.fromInt(0);
        if (b == null) {
            b = 10;
        }
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs);
        var mi = false;
        var j = 0;
        var w = 0;
        for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-" && this.signum() == 0) {
                    mi = true;
                }
                continue;
            }
            w = b * w + x;
            if (++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w, 0);
                j = 0;
                w = 0;
            }
        }
        if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
        }
        if (mi) {
            BigInteger.ZERO.subTo(this, this);
        }
    };
    // BigInteger.prototype.fromNumber = bnpFromNumber;
    // (protected) alternate constructor
    BigInteger.prototype.fromNumber = function (a, b, c) {
        if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    // force MSB set
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                } // force odd
                while (!this.isProbablePrime(b)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > a) {
                        this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                    }
                }
            }
        }
        else {
            // new BigInteger(int,RNG)
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    // (protected) r = this op a (bitwise)
    BigInteger.prototype.bitwiseTo = function (a, op, r) {
        var i;
        var f;
        var m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i) {
            r[i] = op(this[i], a[i]);
        }
        if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) {
                r[i] = op(this[i], f);
            }
            r.t = this.t;
        }
        else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) {
                r[i] = op(f, a[i]);
            }
            r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
    };
    // BigInteger.prototype.changeBit = bnpChangeBit;
    // (protected) this op (1<<n)
    BigInteger.prototype.changeBit = function (n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
    };
    // BigInteger.prototype.addTo = bnpAddTo;
    // (protected) r = this + a
    BigInteger.prototype.addTo = function (a, r) {
        var i = 0;
        var c = 0;
        var m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        }
        else {
            c += this.s;
            while (i < a.t) {
                c += a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c > 0) {
            r[i++] = c;
        }
        else if (c < -1) {
            r[i++] = this.DV + c;
        }
        r.t = i;
        r.clamp();
    };
    // BigInteger.prototype.dMultiply = bnpDMultiply;
    // (protected) this *= n, this >= 0, 1 < n < DV
    BigInteger.prototype.dMultiply = function (n) {
        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
    };
    // BigInteger.prototype.dAddOffset = bnpDAddOffset;
    // (protected) this += n << w words, this >= 0
    BigInteger.prototype.dAddOffset = function (n, w) {
        if (n == 0) {
            return;
        }
        while (this.t <= w) {
            this[this.t++] = 0;
        }
        this[w] += n;
        while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) {
                this[this.t++] = 0;
            }
            ++this[w];
        }
    };
    // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while (i > 0) {
            r[--i] = 0;
        }
        for (var j = r.t - this.t; i < j; ++i) {
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
        }
        for (var j = Math.min(a.t, n); i < j; ++i) {
            this.am(0, a[i], r, i, 0, n - i);
        }
        r.clamp();
    };
    // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0; // assumes a,this >= 0
        while (--i >= 0) {
            r[i] = 0;
        }
        for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
        }
        r.clamp();
        r.drShiftTo(1, r);
    };
    // BigInteger.prototype.modInt = bnpModInt;
    // (protected) this % n, n < 2^26
    BigInteger.prototype.modInt = function (n) {
        if (n <= 0) {
            return 0;
        }
        var d = this.DV % n;
        var r = (this.s < 0) ? n - 1 : 0;
        if (this.t > 0) {
            if (d == 0) {
                r = this[0] % n;
            }
            else {
                for (var i = this.t - 1; i >= 0; --i) {
                    r = (d * r + this[i]) % n;
                }
            }
        }
        return r;
    };
    // BigInteger.prototype.millerRabin = bnpMillerRabin;
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    BigInteger.prototype.millerRabin = function (t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0) {
            return false;
        }
        var r = n1.shiftRight(k);
        t = (t + 1) >> 1;
        if (t > lowprimes.length) {
            t = lowprimes.length;
        }
        var a = nbi();
        for (var i = 0; i < t; ++i) {
            // Pick bases at random, instead of starting at 2
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2, this);
                    if (y.compareTo(BigInteger.ONE) == 0) {
                        return false;
                    }
                }
                if (y.compareTo(n1) != 0) {
                    return false;
                }
            }
        }
        return true;
    };
    // BigInteger.prototype.square = bnSquare;
    // (public) this^2
    BigInteger.prototype.square = function () {
        var r = nbi();
        this.squareTo(r);
        return r;
    };
    //#region ASYNC
    // Public API method
    BigInteger.prototype.gcda = function (a, callback) {
        var x = (this.s < 0) ? this.negate() : this.clone();
        var y = (a.s < 0) ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit();
        var g = y.getLowestSetBit();
        if (g < 0) {
            callback(x);
            return;
        }
        if (i < g) {
            g = i;
        }
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
        var gcda1 = function () {
            if ((i = x.getLowestSetBit()) > 0) {
                x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
                y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            }
            else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
            if (!(x.signum() > 0)) {
                if (g > 0) {
                    y.lShiftTo(g, y);
                }
                setTimeout(function () { callback(y); }, 0); // escape
            }
            else {
                setTimeout(gcda1, 0);
            }
        };
        setTimeout(gcda1, 10);
    };
    // (protected) alternate constructor
    BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
        if ("number" == typeof b) {
            if (a < 2) {
                this.fromInt(1);
            }
            else {
                this.fromNumber(a, c);
                if (!this.testBit(a - 1)) {
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
                }
                if (this.isEven()) {
                    this.dAddOffset(1, 0);
                }
                var bnp_1 = this;
                var bnpfn1_1 = function () {
                    bnp_1.dAddOffset(2, 0);
                    if (bnp_1.bitLength() > a) {
                        bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                    }
                    if (bnp_1.isProbablePrime(b)) {
                        setTimeout(function () { callback(); }, 0); // escape
                    }
                    else {
                        setTimeout(bnpfn1_1, 0);
                    }
                };
                setTimeout(bnpfn1_1, 0);
            }
        }
        else {
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
                x[0] &= ((1 << t) - 1);
            }
            else {
                x[0] = 0;
            }
            this.fromString(x, 256);
        }
    };
    return BigInteger;
}());
//#region REDUCERS
//#region NullExp
var NullExp = /** @class */ (function () {
    function NullExp() {
    }
    // NullExp.prototype.convert = nNop;
    NullExp.prototype.convert = function (x) {
        return x;
    };
    // NullExp.prototype.revert = nNop;
    NullExp.prototype.revert = function (x) {
        return x;
    };
    // NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
    };
    // NullExp.prototype.sqrTo = nSqrTo;
    NullExp.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
    };
    return NullExp;
}());
// Modular reduction using "classic" algorithm
var Classic = /** @class */ (function () {
    function Classic(m) {
        this.m = m;
    }
    // Classic.prototype.convert = cConvert;
    Classic.prototype.convert = function (x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) {
            return x.mod(this.m);
        }
        else {
            return x;
        }
    };
    // Classic.prototype.revert = cRevert;
    Classic.prototype.revert = function (x) {
        return x;
    };
    // Classic.prototype.reduce = cReduce;
    Classic.prototype.reduce = function (x) {
        x.divRemTo(this.m, null, x);
    };
    // Classic.prototype.mulTo = cMulTo;
    Classic.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Classic.prototype.sqrTo = cSqrTo;
    Classic.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Classic;
}());
//#endregion
//#region Montgomery
// Montgomery reduction
var Montgomery = /** @class */ (function () {
    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << (m.DB - 15)) - 1;
        this.mt2 = 2 * m.t;
    }
    // Montgomery.prototype.convert = montConvert;
    // xR mod m
    Montgomery.prototype.convert = function (x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            this.m.subTo(r, r);
        }
        return r;
    };
    // Montgomery.prototype.revert = montRevert;
    // x/R mod m
    Montgomery.prototype.revert = function (x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    };
    // Montgomery.prototype.reduce = montReduce;
    // x = x/R mod m (HAC 14.32)
    Montgomery.prototype.reduce = function (x) {
        while (x.t <= this.mt2) {
            // pad x so am has enough room later
            x[x.t++] = 0;
        }
        for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
            // use am to combine the multiply-shift-add into one call
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            // propagate carry
            while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Montgomery.prototype.mulTo = montMulTo;
    // r = "xy/R mod m"; x,y != r
    Montgomery.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Montgomery.prototype.sqrTo = montSqrTo;
    // r = "x^2/R mod m"; x != r
    Montgomery.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Montgomery;
}());
//#endregion Montgomery
//#region Barrett
// Barrett modular reduction
var Barrett = /** @class */ (function () {
    function Barrett(m) {
        this.m = m;
        // setup Barrett
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
    }
    // Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.convert = function (x) {
        if (x.s < 0 || x.t > 2 * this.m.t) {
            return x.mod(this.m);
        }
        else if (x.compareTo(this.m) < 0) {
            return x;
        }
        else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }
    };
    // Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.revert = function (x) {
        return x;
    };
    // Barrett.prototype.reduce = barrettReduce;
    // x = x mod m (HAC 14.42)
    Barrett.prototype.reduce = function (x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0) {
            x.dAddOffset(1, this.m.t + 1);
        }
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // Barrett.prototype.mulTo = barrettMulTo;
    // r = x*y mod m; x,y != r
    Barrett.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // Barrett.prototype.sqrTo = barrettSqrTo;
    // r = x^2 mod m; x != r
    Barrett.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Barrett;
}());
//#endregion
//#endregion REDUCERS
// return new, unset BigInteger
function nbi() { return new BigInteger(null); }
function parseBigInt(str, r) {
    return new BigInteger(str, r);
}
// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.
// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
        var v = x * this[i++] + w[j] + c;
        c = Math.floor(v / 0x4000000);
        w[j++] = v & 0x3ffffff;
    }
    return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff;
    var xh = x >> 15;
    while (--n >= 0) {
        var l = this[i] & 0x7fff;
        var h = this[i++] >> 15;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
        w[j++] = l & 0x3fffffff;
    }
    return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff;
    var xh = x >> 14;
    while (--n >= 0) {
        var l = this[i] & 0x3fff;
        var h = this[i++] >> 14;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
        c = (l >> 28) + (m >> 14) + xh * h;
        w[j++] = l & 0xfffffff;
    }
    return c;
}
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
}
else if (j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
// Digit conversions
var BI_RC = [];
var rr;
var vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
}
function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
}
// return bigint initialized to value
function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
}
// returns bit length of the integer x
function nbits(x) {
    var r = 1;
    var t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
    }
    return r;
}
// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// prng4.js - uses Arcfour as a PRNG
var Arcfour = /** @class */ (function () {
    function Arcfour() {
        this.i = 0;
        this.j = 0;
        this.S = [];
    }
    // Arcfour.prototype.init = ARC4init;
    // Initialize arcfour context from key, an array of ints, each from [0..255]
    Arcfour.prototype.init = function (key) {
        var i;
        var j;
        var t;
        for (i = 0; i < 256; ++i) {
            this.S[i] = i;
        }
        j = 0;
        for (i = 0; i < 256; ++i) {
            j = (j + this.S[i] + key[i % key.length]) & 255;
            t = this.S[i];
            this.S[i] = this.S[j];
            this.S[j] = t;
        }
        this.i = 0;
        this.j = 0;
    };
    // Arcfour.prototype.next = ARC4next;
    Arcfour.prototype.next = function () {
        var t;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        t = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = t;
        return this.S[(t + this.S[this.i]) & 255];
    };
    return Arcfour;
}());
// Plug in your RNG constructor here
function prng_newstate() {
    return new Arcfour();
}
// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

// Random number generator - requires a PRNG backend, e.g. prng4.js
var rng_state;
var rng_pool = null;
var rng_pptr;
// Initialize the pool with junk if needed.
if (rng_pool == null) {
    rng_pool = [];
    rng_pptr = 0;
    var t = void 0;
    if (globalThis.crypto && globalThis.crypto.getRandomValues) {
        // Extract entropy (2048 bits) from RNG if available
        var z = new Uint32Array(256);
        globalThis.crypto.getRandomValues(z);
        for (t = 0; t < z.length; ++t) {
            rng_pool[rng_pptr++] = z[t] & 255;
        }
    }
    // Use mouse events for entropy, if we do not have enough entropy by the time
    // we need it, entropy will be generated by Math.random.
    var onMouseMoveListener_1 = function (ev) {
        this.count = this.count || 0;
        if (this.count >= 256 || rng_pptr >= rng_psize) {
            if (globalThis.removeEventListener) {
                globalThis.removeEventListener("mousemove", onMouseMoveListener_1, false);
            }
            else if (globalThis.detachEvent) {
                globalThis.detachEvent("onmousemove", onMouseMoveListener_1);
            }
            return;
        }
        try {
            var mouseCoordinates = ev.x + ev.y;
            rng_pool[rng_pptr++] = mouseCoordinates & 255;
            this.count += 1;
        }
        catch (e) {
            // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
        }
    };
    if (globalThis.addEventListener) {
        globalThis.addEventListener("mousemove", onMouseMoveListener_1, false);
    }
    else if (globalThis.attachEvent) {
        globalThis.attachEvent("onmousemove", onMouseMoveListener_1);
    }
}
function rng_get_byte() {
    if (rng_state == null) {
        rng_state = prng_newstate();
        // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
        while (rng_pptr < rng_psize) {
            var random = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = random & 255;
        }
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
            rng_pool[rng_pptr] = 0;
        }
        rng_pptr = 0;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
}
var SecureRandom = /** @class */ (function () {
    function SecureRandom() {
    }
    SecureRandom.prototype.nextBytes = function (ba) {
        for (var i = 0; i < ba.length; ++i) {
            ba[i] = rng_get_byte();
        }
    };
    return SecureRandom;
}());

// Depends on jsbn.js and rng.js
// function linebrk(s,n) {
//   var ret = "";
//   var i = 0;
//   while(i + n < s.length) {
//     ret += s.substring(i,i+n) + "\n";
//     i += n;
//   }
//   return ret + s.substring(i,s.length);
// }
// function byte2Hex(b) {
//   if(b < 0x10)
//     return "0" + b.toString(16);
//   else
//     return b.toString(16);
// }
function pkcs1pad1(s, n) {
    if (n < s.length + 22) {
        console.error("Message too long for RSA");
        return null;
    }
    var len = n - s.length - 6;
    var filler = "";
    for (var f = 0; f < len; f += 2) {
        filler += "ff";
    }
    var m = "0001" + filler + "00" + s;
    return parseBigInt(m, 16);
}
// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
    if (n < s.length + 11) { // TODO: fix for utf-8
        console.error("Message too long for RSA");
        return null;
    }
    var ba = [];
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--);
        if (c < 128) { // encode using utf-8
            ba[--n] = c;
        }
        else if ((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
        }
        else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
        }
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = [];
    while (n > 2) { // random non-zero pad
        x[0] = 0;
        while (x[0] == 0) {
            rng.nextBytes(x);
        }
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}
// "empty" RSA key constructor
var RSAKey = /** @class */ (function () {
    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
    }
    //#region PROTECTED
    // protected
    // RSAKey.prototype.doPublic = RSADoPublic;
    // Perform raw public operation on "x": return x^e (mod n)
    RSAKey.prototype.doPublic = function (x) {
        return x.modPowInt(this.e, this.n);
    };
    // RSAKey.prototype.doPrivate = RSADoPrivate;
    // Perform raw private operation on "x": return x^d (mod n)
    RSAKey.prototype.doPrivate = function (x) {
        if (this.p == null || this.q == null) {
            return x.modPow(this.d, this.n);
        }
        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p);
        var xq = x.mod(this.q).modPow(this.dmq1, this.q);
        while (xp.compareTo(xq) < 0) {
            xp = xp.add(this.p);
        }
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    };
    //#endregion PROTECTED
    //#region PUBLIC
    // RSAKey.prototype.setPublic = RSASetPublic;
    // Set the public key fields N and e from hex strings
    RSAKey.prototype.setPublic = function (N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
        }
        else {
            console.error("Invalid RSA public key");
        }
    };
    // RSAKey.prototype.encrypt = RSAEncrypt;
    // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
    RSAKey.prototype.encrypt = function (text) {
        var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
        if (m == null) {
            return null;
        }
        var c = this.doPublic(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        if ((h.length & 1) == 0) {
            return h;
        }
        else {
            return "0" + h;
        }
    };
    // RSAKey.prototype.setPrivate = RSASetPrivate;
    // Set the private key fields N, e, and d from hex strings
    RSAKey.prototype.setPrivate = function (N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
    // Set the private key fields N, e, d and CRT params from hex strings
    RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
            this.p = parseBigInt(P, 16);
            this.q = parseBigInt(Q, 16);
            this.dmp1 = parseBigInt(DP, 16);
            this.dmq1 = parseBigInt(DQ, 16);
            this.coeff = parseBigInt(C, 16);
        }
        else {
            console.error("Invalid RSA private key");
        }
    };
    // RSAKey.prototype.generate = RSAGenerate;
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generate = function (B, E) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        for (;;) {
            for (;;) {
                this.p = new BigInteger(B - qs, 1, rng);
                if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
                    break;
                }
            }
            for (;;) {
                this.q = new BigInteger(qs, 1, rng);
                if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
                    break;
                }
            }
            if (this.p.compareTo(this.q) <= 0) {
                var t = this.p;
                this.p = this.q;
                this.q = t;
            }
            var p1 = this.p.subtract(BigInteger.ONE);
            var q1 = this.q.subtract(BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                this.n = this.p.multiply(this.q);
                this.d = ee.modInverse(phi);
                this.dmp1 = this.d.mod(p1);
                this.dmq1 = this.d.mod(q1);
                this.coeff = this.q.modInverse(this.p);
                break;
            }
        }
    };
    // RSAKey.prototype.decrypt = RSADecrypt;
    // Return the PKCS#1 RSA decryption of "ctext".
    // "ctext" is an even-length hex string and the output is a plain string.
    RSAKey.prototype.decrypt = function (ctext) {
        var c = parseBigInt(ctext, 16);
        var m = this.doPrivate(c);
        if (m == null) {
            return null;
        }
        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
    };
    // Generate a new random private key B bits long, using public expt E
    RSAKey.prototype.generateAsync = function (B, E, callback) {
        var rng = new SecureRandom();
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        var rsa = this;
        // These functions have non-descript names because they were originally for(;;) loops.
        // I don't know about cryptography to give them better names than loop1-4.
        var loop1 = function () {
            var loop4 = function () {
                if (rsa.p.compareTo(rsa.q) <= 0) {
                    var t = rsa.p;
                    rsa.p = rsa.q;
                    rsa.q = t;
                }
                var p1 = rsa.p.subtract(BigInteger.ONE);
                var q1 = rsa.q.subtract(BigInteger.ONE);
                var phi = p1.multiply(q1);
                if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                    rsa.n = rsa.p.multiply(rsa.q);
                    rsa.d = ee.modInverse(phi);
                    rsa.dmp1 = rsa.d.mod(p1);
                    rsa.dmq1 = rsa.d.mod(q1);
                    rsa.coeff = rsa.q.modInverse(rsa.p);
                    setTimeout(function () { callback(); }, 0); // escape
                }
                else {
                    setTimeout(loop1, 0);
                }
            };
            var loop3 = function () {
                rsa.q = nbi();
                rsa.q.fromNumberAsync(qs, 1, rng, function () {
                    rsa.q.subtract(BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                            setTimeout(loop4, 0);
                        }
                        else {
                            setTimeout(loop3, 0);
                        }
                    });
                });
            };
            var loop2 = function () {
                rsa.p = nbi();
                rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                    rsa.p.subtract(BigInteger.ONE).gcda(ee, function (r) {
                        if (r.compareTo(BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                            setTimeout(loop3, 0);
                        }
                        else {
                            setTimeout(loop2, 0);
                        }
                    });
                });
            };
            setTimeout(loop2, 0);
        };
        setTimeout(loop1, 0);
    };
    RSAKey.prototype.sign = function (text, digestMethod, digestName) {
        var header = getDigestHeader(digestName);
        var digest = header + digestMethod(text).toString();
        var m = pkcs1pad1(digest, this.n.bitLength() / 4);
        if (m == null) {
            return null;
        }
        var c = this.doPrivate(m);
        if (c == null) {
            return null;
        }
        var h = c.toString(16);
        if ((h.length & 1) == 0) {
            return h;
        }
        else {
            return "0" + h;
        }
    };
    RSAKey.prototype.verify = function (text, signature, digestMethod) {
        var c = parseBigInt(signature, 16);
        var m = this.doPublic(c);
        if (m == null) {
            return null;
        }
        var unpadded = m.toString(16).replace(/^1f+00/, "");
        var digest = removeDigestHeader(unpadded);
        return digest == digestMethod(text).toString();
    };
    return RSAKey;
}());
// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
        ++i;
    }
    if (b.length - i != n - 1 || b[i] != 2) {
        return null;
    }
    ++i;
    while (b[i] != 0) {
        if (++i >= b.length) {
            return null;
        }
    }
    var ret = "";
    while (++i < b.length) {
        var c = b[i] & 255;
        if (c < 128) { // utf-8 decode
            ret += String.fromCharCode(c);
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63));
            i += 2;
        }
    }
    return ret;
}
// https://tools.ietf.org/html/rfc3447#page-43
var DIGEST_HEADERS = {
    md2: "3020300c06082a864886f70d020205000410",
    md5: "3020300c06082a864886f70d020505000410",
    sha1: "3021300906052b0e03021a05000414",
    sha224: "302d300d06096086480165030402040500041c",
    sha256: "3031300d060960864801650304020105000420",
    sha384: "3041300d060960864801650304020205000430",
    sha512: "3051300d060960864801650304020305000440",
    ripemd160: "3021300906052b2403020105000414",
};
function getDigestHeader(name) {
    return DIGEST_HEADERS[name] || "";
}
function removeDigestHeader(str) {
    for (var name_1 in DIGEST_HEADERS) {
        if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
            var header = DIGEST_HEADERS[name_1];
            var len = header.length;
            if (str.substr(0, len) == header) {
                return str.substr(len);
            }
        }
    }
    return str;
}
// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
// function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
// }
// public
// RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
var YAHOO = {};
YAHOO.lang = {
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        if (! superc || ! subc) {
            throw new Error("YAHOO.lang.extend failed, please check that " +
                "all dependencies are included.");
        }

        var F = function() {};
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;

        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }

        if (overrides) {
            var i;
            for (i in overrides) {
                subc.prototype[i] = overrides[i];
            }

            /*
             * IE will not enumerate native functions in a derived object even if the
             * function was overridden.  This is a workaround for specific functions
             * we care about on the Object prototype.
             * @property _IEEnumFix
             * @param {Function} r  the object to receive the augmentation
             * @param {Function} s  the object that supplies the properties to augment
             * @static
             * @private
             */
            var _IEEnumFix = function() {},
                ADD = ["toString", "valueOf"];
            try {
                if (/MSIE/.test(navigator.userAgent)) {
                    _IEEnumFix = function(r, s) {
                        for (i = 0; i < ADD.length; i = i + 1) {
                            var fname = ADD[i], f = s[fname];
                            if (typeof f === 'function' && f != Object.prototype[fname]) {
                                r[fname] = f;
                            }
                        }
                    };
                }
            } catch (ex) {}            _IEEnumFix(subc.prototype, overrides);
        }
    }
};

/* asn1-1.0.13.js (c) 2013-2017 Kenji Urushima | kjur.github.com/jsrsasign/license
 */

/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.13 (2017-Jun-02)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */

/**
 * kjur's class library name space
 * <p>
 * This name space provides following name spaces:
 * <ul>
 * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
 * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
 * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
 * class and utilities</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * @name KJUR
 * @namespace kjur's class library name space
 */
var KJUR = {};

/**
 * kjur's ASN.1 class library name space
 * <p>
 * This is ITU-T X.690 ASN.1 DER encoder class library and
 * class structure and methods is very similar to
 * org.bouncycastle.asn1 package of
 * well known BouncyCaslte Cryptography Library.
 * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
 * Here are ASN.1 DER primitive classes.
 * <ul>
 * <li>0x01 {@link KJUR.asn1.DERBoolean}</li>
 * <li>0x02 {@link KJUR.asn1.DERInteger}</li>
 * <li>0x03 {@link KJUR.asn1.DERBitString}</li>
 * <li>0x04 {@link KJUR.asn1.DEROctetString}</li>
 * <li>0x05 {@link KJUR.asn1.DERNull}</li>
 * <li>0x06 {@link KJUR.asn1.DERObjectIdentifier}</li>
 * <li>0x0a {@link KJUR.asn1.DEREnumerated}</li>
 * <li>0x0c {@link KJUR.asn1.DERUTF8String}</li>
 * <li>0x12 {@link KJUR.asn1.DERNumericString}</li>
 * <li>0x13 {@link KJUR.asn1.DERPrintableString}</li>
 * <li>0x14 {@link KJUR.asn1.DERTeletexString}</li>
 * <li>0x16 {@link KJUR.asn1.DERIA5String}</li>
 * <li>0x17 {@link KJUR.asn1.DERUTCTime}</li>
 * <li>0x18 {@link KJUR.asn1.DERGeneralizedTime}</li>
 * <li>0x30 {@link KJUR.asn1.DERSequence}</li>
 * <li>0x31 {@link KJUR.asn1.DERSet}</li>
 * </ul>
 * <h4>OTHER ASN.1 CLASSES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.ASN1Object}</li>
 * <li>{@link KJUR.asn1.DERAbstractString}</li>
 * <li>{@link KJUR.asn1.DERAbstractTime}</li>
 * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
 * <li>{@link KJUR.asn1.DERTaggedObject}</li>
 * </ul>
 * <h4>SUB NAME SPACES</h4>
 * <ul>
 * <li>{@link KJUR.asn1.cades} - CAdES long term signature format</li>
 * <li>{@link KJUR.asn1.cms} - Cryptographic Message Syntax</li>
 * <li>{@link KJUR.asn1.csr} - Certificate Signing Request (CSR/PKCS#10)</li>
 * <li>{@link KJUR.asn1.tsp} - RFC 3161 Timestamping Protocol Format</li>
 * <li>{@link KJUR.asn1.x509} - RFC 5280 X.509 certificate and CRL</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace.
 * This caused by a bug of jsdoc2.
 * @name KJUR.asn1
 * @namespace
 */
if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) KJUR.asn1 = {};

/**
 * ASN1 utilities class
 * @name KJUR.asn1.ASN1Util
 * @class ASN1 utilities class
 * @since asn1 1.0.2
 */
KJUR.asn1.ASN1Util = new function() {
    this.integerToByteHex = function(i) {
        var h = i.toString(16);
        if ((h.length % 2) == 1) h = '0' + h;
        return h;
    };
    this.bigIntToMinTwosComplementsHex = function(bigIntegerValue) {
        var h = bigIntegerValue.toString(16);
        if (h.substr(0, 1) != '-') {
            if (h.length % 2 == 1) {
                h = '0' + h;
            } else {
                if (! h.match(/^[0-7]/)) {
                    h = '00' + h;
                }
            }
        } else {
            var hPos = h.substr(1);
            var xorLen = hPos.length;
            if (xorLen % 2 == 1) {
                xorLen += 1;
            } else {
                if (! h.match(/^[0-7]/)) {
                    xorLen += 2;
                }
            }
            var hMask = '';
            for (var i = 0; i < xorLen; i++) {
                hMask += 'f';
            }
            var biMask = new BigInteger(hMask, 16);
            var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
            h = biNeg.toString(16).replace(/^-/, '');
        }
        return h;
    };
    /**
     * get PEM string from hexadecimal data and header string
     * @name getPEMStringFromHex
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {String} dataHex hexadecimal string of PEM body
     * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
     * @return {String} PEM formatted string of input data
     * @description
     * This method converts a hexadecimal string to a PEM string with
     * a specified header. Its line break will be CRLF("\r\n").
     * @example
     * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
     * // value of pem will be:
     * -----BEGIN PRIVATE KEY-----
     * YWFh
     * -----END PRIVATE KEY-----
     */
    this.getPEMStringFromHex = function(dataHex, pemHeader) {
        return hextopem(dataHex, pemHeader);
    };

    /**
     * generate ASN1Object specifed by JSON parameters
     * @name newObject
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return {KJUR.asn1.ASN1Object} generated object
     * @since asn1 1.0.3
     * @description
     * generate any ASN1Object specified by JSON param
     * including ASN.1 primitive or structured.
     * Generally 'param' can be described as follows:
     * <blockquote>
     * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
     * </blockquote>
     * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
     * <ul>
     * <li>'bool' - DERBoolean</li>
     * <li>'int' - DERInteger</li>
     * <li>'bitstr' - DERBitString</li>
     * <li>'octstr' - DEROctetString</li>
     * <li>'null' - DERNull</li>
     * <li>'oid' - DERObjectIdentifier</li>
     * <li>'enum' - DEREnumerated</li>
     * <li>'utf8str' - DERUTF8String</li>
     * <li>'numstr' - DERNumericString</li>
     * <li>'prnstr' - DERPrintableString</li>
     * <li>'telstr' - DERTeletexString</li>
     * <li>'ia5str' - DERIA5String</li>
     * <li>'utctime' - DERUTCTime</li>
     * <li>'gentime' - DERGeneralizedTime</li>
     * <li>'seq' - DERSequence</li>
     * <li>'set' - DERSet</li>
     * <li>'tag' - DERTaggedObject</li>
     * </ul>
     * @example
     * newObject({'prnstr': 'aaa'});
     * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
     * // ASN.1 Tagged Object
     * newObject({'tag': {'tag': 'a1',
     *                    'explicit': true,
     *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
     * // more simple representation of ASN.1 Tagged Object
     * newObject({'tag': ['a1',
     *                    true,
     *                    {'seq': [
     *                      {'int': 3},
     *                      {'prnstr': 'aaa'}]}
     *                   ]});
     */
    this.newObject = function(param) {
        var _KJUR = KJUR,
            _KJUR_asn1 = _KJUR.asn1,
            _DERBoolean = _KJUR_asn1.DERBoolean,
            _DERInteger = _KJUR_asn1.DERInteger,
            _DERBitString = _KJUR_asn1.DERBitString,
            _DEROctetString = _KJUR_asn1.DEROctetString,
            _DERNull = _KJUR_asn1.DERNull,
            _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier,
            _DEREnumerated = _KJUR_asn1.DEREnumerated,
            _DERUTF8String = _KJUR_asn1.DERUTF8String,
            _DERNumericString = _KJUR_asn1.DERNumericString,
            _DERPrintableString = _KJUR_asn1.DERPrintableString,
            _DERTeletexString = _KJUR_asn1.DERTeletexString,
            _DERIA5String = _KJUR_asn1.DERIA5String,
            _DERUTCTime = _KJUR_asn1.DERUTCTime,
            _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime,
            _DERSequence = _KJUR_asn1.DERSequence,
            _DERSet = _KJUR_asn1.DERSet,
            _DERTaggedObject = _KJUR_asn1.DERTaggedObject,
            _newObject = _KJUR_asn1.ASN1Util.newObject;

        var keys = Object.keys(param);
        if (keys.length != 1)
            throw "key of param shall be only one.";
        var key = keys[0];

        if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
            throw "undefined key: " + key;

        if (key == "bool")    return new _DERBoolean(param[key]);
        if (key == "int")     return new _DERInteger(param[key]);
        if (key == "bitstr")  return new _DERBitString(param[key]);
        if (key == "octstr")  return new _DEROctetString(param[key]);
        if (key == "null")    return new _DERNull(param[key]);
        if (key == "oid")     return new _DERObjectIdentifier(param[key]);
        if (key == "enum")    return new _DEREnumerated(param[key]);
        if (key == "utf8str") return new _DERUTF8String(param[key]);
        if (key == "numstr")  return new _DERNumericString(param[key]);
        if (key == "prnstr")  return new _DERPrintableString(param[key]);
        if (key == "telstr")  return new _DERTeletexString(param[key]);
        if (key == "ia5str")  return new _DERIA5String(param[key]);
        if (key == "utctime") return new _DERUTCTime(param[key]);
        if (key == "gentime") return new _DERGeneralizedTime(param[key]);

        if (key == "seq") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSequence({'array': a});
        }

        if (key == "set") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
                var asn1Obj = _newObject(paramList[i]);
                a.push(asn1Obj);
            }
            return new _DERSet({'array': a});
        }

        if (key == "tag") {
            var tagParam = param[key];
            if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
                tagParam.length == 3) {
                var obj = _newObject(tagParam[2]);
                return new _DERTaggedObject({tag: tagParam[0],
                    explicit: tagParam[1],
                    obj: obj});
            } else {
                var newParam = {};
                if (tagParam.explicit !== undefined)
                    newParam.explicit = tagParam.explicit;
                if (tagParam.tag !== undefined)
                    newParam.tag = tagParam.tag;
                if (tagParam.obj === undefined)
                    throw "obj shall be specified for 'tag'.";
                newParam.obj = _newObject(tagParam.obj);
                return new _DERTaggedObject(newParam);
            }
        }
    };

    /**
     * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
     * @name jsonToASN1HEX
     * @memberOf KJUR.asn1.ASN1Util
     * @function
     * @param {Array} param JSON parameter to generate ASN1Object
     * @return hexadecimal string of ASN1Object
     * @since asn1 1.0.4
     * @description
     * As for ASN.1 object representation of JSON object,
     * please see {@link newObject}.
     * @example
     * jsonToASN1HEX({'prnstr': 'aaa'});
     */
    this.jsonToASN1HEX = function(param) {
        var asn1Obj = this.newObject(param);
        return asn1Obj.getEncodedHex();
    };
};

/**
 * get dot noted oid number string from hexadecimal value of OID
 * @name oidHexToInt
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} hex hexadecimal value of object identifier
 * @return {String} dot noted string of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from hexadecimal string representation of
 * ASN.1 value of object identifier to oid number string.
 * @example
 * KJUR.asn1.ASN1Util.oidHexToInt('550406') &rarr; "2.5.4.6"
 */
KJUR.asn1.ASN1Util.oidHexToInt = function(hex) {
    var s = "";
    var i01 = parseInt(hex.substr(0, 2), 16);
    var i0 = Math.floor(i01 / 40);
    var i1 = i01 % 40;
    var s = i0 + "." + i1;

    var binbuf = "";
    for (var i = 2; i < hex.length; i += 2) {
        var value = parseInt(hex.substr(i, 2), 16);
        var bin = ("00000000" + value.toString(2)).slice(- 8);
        binbuf = binbuf + bin.substr(1, 7);
        if (bin.substr(0, 1) == "0") {
            var bi = new BigInteger(binbuf, 2);
            s = s + "." + bi.toString(10);
            binbuf = "";
        }
    }
    return s;
};

/**
 * get hexadecimal value of object identifier from dot noted oid value
 * @name oidIntToHex
 * @memberOf KJUR.asn1.ASN1Util
 * @function
 * @param {String} oidString dot noted string of object identifier
 * @return {String} hexadecimal value of object identifier
 * @since jsrsasign 4.8.3 asn1 1.0.7
 * @description
 * This static method converts from object identifier value string.
 * to hexadecimal string representation of it.
 * @example
 * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
 */
KJUR.asn1.ASN1Util.oidIntToHex = function(oidString) {
    var itox = function(i) {
        var h = i.toString(16);
        if (h.length == 1) h = '0' + h;
        return h;
    };

    var roidtox = function(roid) {
        var h = '';
        var bi = new BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7) padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++) bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7) b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };

    if (! oidString.match(/^[0-9.]+$/)) {
        throw "malformed oid string: " + oidString;
    }
    var h = '';
    var a = oidString.split('.');
    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
    h += itox(i0);
    a.splice(0, 2);
    for (var i = 0; i < a.length; i++) {
        h += roidtox(a[i]);
    }
    return h;
};


// ********************************************************************
//  Abstract ASN.1 Classes
// ********************************************************************

// ********************************************************************

/**
 * base class for ASN.1 DER encoder object
 * @name KJUR.asn1.ASN1Object
 * @class base class for ASN.1 DER encoder object
 * @property {Boolean} isModified flag whether internal data was changed
 * @property {String} hTLV hexadecimal string of ASN.1 TLV
 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
 * @description
 */
KJUR.asn1.ASN1Object = function() {
    var hV = '';

    /**
     * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
     * @name getLengthHexFromValue
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV length(L)
     */
    this.getLengthHexFromValue = function() {
        if (typeof this.hV == "undefined" || this.hV == null) {
            throw "this.hV is null or undefined.";
        }
        if (this.hV.length % 2 == 1) {
            throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
        }
        var n = this.hV.length / 2;
        var hN = n.toString(16);
        if (hN.length % 2 == 1) {
            hN = "0" + hN;
        }
        if (n < 128) {
            return hN;
        } else {
            var hNlen = hN.length / 2;
            if (hNlen > 15) {
                throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
            }
            var head = 128 + hNlen;
            return head.toString(16) + hN;
        }
    };

    /**
     * get hexadecimal string of ASN.1 TLV bytes
     * @name getEncodedHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV
     */
    this.getEncodedHex = function() {
        if (this.hTLV == null || this.isModified) {
            this.hV = this.getFreshValueHex();
            this.hL = this.getLengthHexFromValue();
            this.hTLV = this.hT + this.hL + this.hV;
            this.isModified = false;
            //alert("first time: " + this.hTLV);
        }
        return this.hTLV;
    };

    /**
     * get hexadecimal string of ASN.1 TLV value(V) bytes
     * @name getValueHex
     * @memberOf KJUR.asn1.ASN1Object#
     * @function
     * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
     */
    this.getValueHex = function() {
        this.getEncodedHex();
        return this.hV;
    };

    this.getFreshValueHex = function() {
        return '';
    };
};

// == BEGIN DERAbstractString ================================================
/**
 * base class for ASN.1 DER string classes
 * @name KJUR.asn1.DERAbstractString
 * @class base class for ASN.1 DER string classes
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @property {String} s internal string of value
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERAbstractString = function(params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @return {String} string value of this string object
     */
    this.getString = function() {
        return this.s;
    };

    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newS value by a string to set
     */
    this.setString = function(newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(this.s);
    };

    /**
     * set value by a hexadecimal string
     * @name setStringHex
     * @memberOf KJUR.asn1.DERAbstractString#
     * @function
     * @param {String} newHexString value by a hexadecimal string to set
     */
    this.setStringHex = function(newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params == "string") {
            this.setString(params);
        } else if (typeof params['str'] != "undefined") {
            this.setString(params['str']);
        } else if (typeof params['hex'] != "undefined") {
            this.setStringHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
// == END   DERAbstractString ================================================

// == BEGIN DERAbstractTime ==================================================
/**
 * base class for ASN.1 DER Generalized/UTCTime class
 * @name KJUR.asn1.DERAbstractTime
 * @class base class for ASN.1 DER Generalized/UTCTime class
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractTime = function(params) {
    KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);

    // --- PRIVATE METHODS --------------------
    this.localDateToUTC = function(d) {
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var utcDate = new Date(utc);
        return utcDate;
    };

    /*
     * format date string by Data object
     * @name formatDate
     * @memberOf KJUR.asn1.AbstractTime;
     * @param {Date} dateObject
     * @param {string} type 'utc' or 'gen'
     * @param {boolean} withMillis flag for with millisections or not
     * @description
     * 'withMillis' flag is supported from asn1 1.0.6.
     */
    this.formatDate = function(dateObject, type, withMillis) {
        var pad = this.zeroPadding;
        var d = this.localDateToUTC(dateObject);
        var year = String(d.getFullYear());
        if (type == 'utc') year = year.substr(2, 2);
        var month = pad(String(d.getMonth() + 1), 2);
        var day = pad(String(d.getDate()), 2);
        var hour = pad(String(d.getHours()), 2);
        var min = pad(String(d.getMinutes()), 2);
        var sec = pad(String(d.getSeconds()), 2);
        var s = year + month + day + hour + min + sec;
        if (withMillis === true) {
            var millis = d.getMilliseconds();
            if (millis != 0) {
                var sMillis = pad(String(millis), 3);
                sMillis = sMillis.replace(/[0]+$/, "");
                s = s + "." + sMillis;
            }
        }
        return s + "Z";
    };

    this.zeroPadding = function(s, len) {
        if (s.length >= len) return s;
        return new Array(len - s.length + 1).join('0') + s;
    };

    // --- PUBLIC METHODS --------------------
    /**
     * get string value of this string object
     * @name getString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @return {String} string value of this time object
     */
    this.getString = function() {
        return this.s;
    };

    /**
     * set value by a string
     * @name setString
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {String} newS value by a string to set such like "130430235959Z"
     */
    this.setString = function(newS) {
        this.hTLV = null;
        this.isModified = true;
        this.s = newS;
        this.hV = stohex(newS);
    };

    /**
     * set value by a Date object
     * @name setByDateValue
     * @memberOf KJUR.asn1.DERAbstractTime#
     * @function
     * @param {Integer} year year of date (ex. 2013)
     * @param {Integer} month month of date between 1 and 12 (ex. 12)
     * @param {Integer} day day of month
     * @param {Integer} hour hours of date
     * @param {Integer} min minutes of date
     * @param {Integer} sec seconds of date
     */
    this.setByDateValue = function(year, month, day, hour, min, sec) {
        var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
        this.setByDate(dateObject);
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
// == END   DERAbstractTime ==================================================

// == BEGIN DERAbstractStructured ============================================
/**
 * base class for ASN.1 DER structured class
 * @name KJUR.asn1.DERAbstractStructured
 * @class base class for ASN.1 DER structured class
 * @property {Array} asn1Array internal array of ASN1Object
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERAbstractStructured = function(params) {
    KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

    /**
     * set value by array of ASN1Object
     * @name setByASN1ObjectArray
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {array} asn1ObjectArray array of ASN1Object to set
     */
    this.setByASN1ObjectArray = function(asn1ObjectArray) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array = asn1ObjectArray;
    };

    /**
     * append an ASN1Object to internal array
     * @name appendASN1Object
     * @memberOf KJUR.asn1.DERAbstractStructured#
     * @function
     * @param {ASN1Object} asn1Object to add
     */
    this.appendASN1Object = function(asn1Object) {
        this.hTLV = null;
        this.isModified = true;
        this.asn1Array.push(asn1Object);
    };

    this.asn1Array = new Array();
    if (typeof params != "undefined") {
        if (typeof params['array'] != "undefined") {
            this.asn1Array = params['array'];
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);


// ********************************************************************
//  ASN.1 Object Classes
// ********************************************************************

// ********************************************************************
/**
 * class for ASN.1 DER Boolean
 * @name KJUR.asn1.DERBoolean
 * @class class for ASN.1 DER Boolean
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERBoolean = function() {
    KJUR.asn1.DERBoolean.superclass.constructor.call(this);
    this.hT = "01";
    this.hTLV = "0101ff";
};
YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER Integer
 * @name KJUR.asn1.DERInteger
 * @class class for ASN.1 DER Integer
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERInteger = function(params) {
    KJUR.asn1.DERInteger.superclass.constructor.call(this);
    this.hT = "02";

    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function(bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };

    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DERInteger
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function(intValue) {
        var bi = new BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };

    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DERInteger#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     * @example
     * new KJUR.asn1.DERInteger(123);
     * new KJUR.asn1.DERInteger({'int': 123});
     * new KJUR.asn1.DERInteger({'hex': '1fad'});
     */
    this.setValueHex = function(newHexString) {
        this.hV = newHexString;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params['bigint'] != "undefined") {
            this.setByBigInteger(params['bigint']);
        } else if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        } else if (typeof params == "number") {
            this.setByInteger(params);
        } else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER encoded BitString primitive
 * @name KJUR.asn1.DERBitString
 * @class class for ASN.1 DER encoded BitString primitive
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>bin - specify binary string (ex. '10111')</li>
 * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
 * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
 * <li>obj - specify {@link KJUR.asn1.ASN1Util.newObject}
 * argument for "BitString encapsulates" structure.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: 'obj' parameter have been supported since
 * asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).<br/>
 * @example
 * // default constructor
 * o = new KJUR.asn1.DERBitString();
 * // initialize with binary string
 * o = new KJUR.asn1.DERBitString({bin: "1011"});
 * // initialize with boolean array
 * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
 * // initialize with hexadecimal string (04 is unused bits)
 * o = new KJUR.asn1.DEROctetString({hex: "04bac0"});
 * // initialize with ASN1Util.newObject argument for encapsulated
 * o = new KJUR.asn1.DERBitString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // BIT STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DERBitString = function(params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = "00" + o.getEncodedHex();
    }
    KJUR.asn1.DERBitString.superclass.constructor.call(this);
    this.hT = "03";

    /**
     * set ASN.1 value(V) by a hexadecimal string including unused bits
     * @name setHexValueIncludingUnusedBits
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} newHexStringIncludingUnusedBits
     */
    this.setHexValueIncludingUnusedBits = function(newHexStringIncludingUnusedBits) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = newHexStringIncludingUnusedBits;
    };

    /**
     * set ASN.1 value(V) by unused bit and hexadecimal string of value
     * @name setUnusedBitsAndHexValue
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {Integer} unusedBits
     * @param {String} hValue
     */
    this.setUnusedBitsAndHexValue = function(unusedBits, hValue) {
        if (unusedBits < 0 || 7 < unusedBits) {
            throw "unused bits shall be from 0 to 7: u = " + unusedBits;
        }
        var hUnusedBits = "0" + unusedBits;
        this.hTLV = null;
        this.isModified = true;
        this.hV = hUnusedBits + hValue;
    };

    /**
     * set ASN.1 DER BitString by binary string<br/>
     * @name setByBinaryString
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {String} binaryString binary value string (i.e. '10111')
     * @description
     * Its unused bits will be calculated automatically by length of
     * 'binaryValue'. <br/>
     * NOTE: Trailing zeros '0' will be ignored.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray("01011");
     */
    this.setByBinaryString = function(binaryString) {
        binaryString = binaryString.replace(/0+$/, '');
        var unusedBits = 8 - binaryString.length % 8;
        if (unusedBits == 8) unusedBits = 0;
        for (var i = 0; i <= unusedBits; i++) {
            binaryString += '0';
        }
        var h = '';
        for (var i = 0; i < binaryString.length - 1; i += 8) {
            var b = binaryString.substr(i, 8);
            var x = parseInt(b, 2).toString(16);
            if (x.length == 1) x = '0' + x;
            h += x;
        }
        this.hTLV = null;
        this.isModified = true;
        this.hV = '0' + unusedBits + h;
    };

    /**
     * set ASN.1 TLV value(V) by an array of boolean<br/>
     * @name setByBooleanArray
     * @memberOf KJUR.asn1.DERBitString#
     * @function
     * @param {array} booleanArray array of boolean (ex. [true, false, true])
     * @description
     * NOTE: Trailing falses will be ignored in the ASN.1 DER Object.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.setByBooleanArray([false, true, false, true, true]);
     */
    this.setByBooleanArray = function(booleanArray) {
        var s = '';
        for (var i = 0; i < booleanArray.length; i++) {
            if (booleanArray[i] == true) {
                s += '1';
            } else {
                s += '0';
            }
        }
        this.setByBinaryString(s);
    };

    /**
     * generate an array of falses with specified length<br/>
     * @name newFalseArray
     * @memberOf KJUR.asn1.DERBitString
     * @function
     * @param {Integer} nLength length of array to generate
     * @return {array} array of boolean falses
     * @description
     * This static method may be useful to initialize boolean array.
     * @example
     * o = new KJUR.asn1.DERBitString();
     * o.newFalseArray(3) &rarr; [false, false, false]
     */
    this.newFalseArray = function(nLength) {
        var a = new Array(nLength);
        for (var i = 0; i < nLength; i++) {
            a[i] = false;
        }
        return a;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
            this.setHexValueIncludingUnusedBits(params);
        } else if (typeof params['hex'] != "undefined") {
            this.setHexValueIncludingUnusedBits(params['hex']);
        } else if (typeof params['bin'] != "undefined") {
            this.setByBinaryString(params['bin']);
        } else if (typeof params['array'] != "undefined") {
            this.setByBooleanArray(params['array']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER OctetString<br/>
 * @name KJUR.asn1.DEROctetString
 * @class class for ASN.1 DER OctetString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * This class provides ASN.1 OctetString simple type.<br/>
 * Supported "params" attributes are:
 * <ul>
 * <li>str - to set a string as a value</li>
 * <li>hex - to set a hexadecimal string as a value</li>
 * <li>obj - to set a encapsulated ASN.1 value by JSON object
 * which is defined in {@link KJUR.asn1.ASN1Util.newObject}</li>
 * </ul>
 * NOTE: A parameter 'obj' have been supported
 * for "OCTET STRING, encapsulates" structure.
 * since asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).
 * @see KJUR.asn1.DERAbstractString - superclass
 * @example
 * // default constructor
 * o = new KJUR.asn1.DEROctetString();
 * // initialize with string
 * o = new KJUR.asn1.DEROctetString({str: "aaa"});
 * // initialize with hexadecimal string
 * o = new KJUR.asn1.DEROctetString({hex: "616161"});
 * // initialize with ASN1Util.newObject argument
 * o = new KJUR.asn1.DEROctetString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
 * // above generates a ASN.1 data like this:
 * // OCTET STRING, encapsulates {
 * //   SEQUENCE {
 * //     INTEGER 3
 * //     PrintableString 'aaa'
 * //     }
 * //   }
 */
KJUR.asn1.DEROctetString = function(params) {
    if (params !== undefined && typeof params.obj !== "undefined") {
        var o = KJUR.asn1.ASN1Util.newObject(params.obj);
        params.hex = o.getEncodedHex();
    }
    KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
    this.hT = "04";
};
YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER Null
 * @name KJUR.asn1.DERNull
 * @class class for ASN.1 DER Null
 * @extends KJUR.asn1.ASN1Object
 * @description
 * @see KJUR.asn1.ASN1Object - superclass
 */
KJUR.asn1.DERNull = function() {
    KJUR.asn1.DERNull.superclass.constructor.call(this);
    this.hT = "05";
    this.hTLV = "0500";
};
YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER ObjectIdentifier
 * @name KJUR.asn1.DERObjectIdentifier
 * @class class for ASN.1 DER ObjectIdentifier
 * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERObjectIdentifier = function(params) {
    var itox = function(i) {
        var h = i.toString(16);
        if (h.length == 1) h = '0' + h;
        return h;
    };
    var roidtox = function(roid) {
        var h = '';
        var bi = new BigInteger(roid, 10);
        var b = bi.toString(2);
        var padLen = 7 - b.length % 7;
        if (padLen == 7) padLen = 0;
        var bPad = '';
        for (var i = 0; i < padLen; i++) bPad += '0';
        b = bPad + b;
        for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7) b8 = '1' + b8;
            h += itox(parseInt(b8, 2));
        }
        return h;
    };

    KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
    this.hT = "06";

    /**
     * set value by a hexadecimal string
     * @name setValueHex
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} newHexString hexadecimal value of OID bytes
     */
    this.setValueHex = function(newHexString) {
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = newHexString;
    };

    /**
     * set value by a OID string<br/>
     * @name setValueOidString
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidString OID string (ex. 2.5.4.13)
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueOidString("2.5.4.13");
     */
    this.setValueOidString = function(oidString) {
        if (! oidString.match(/^[0-9.]+$/)) {
            throw "malformed oid string: " + oidString;
        }
        var h = '';
        var a = oidString.split('.');
        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
        }
        this.hTLV = null;
        this.isModified = true;
        this.s = null;
        this.hV = h;
    };

    /**
     * set value by a OID name
     * @name setValueName
     * @memberOf KJUR.asn1.DERObjectIdentifier#
     * @function
     * @param {String} oidName OID name (ex. 'serverAuth')
     * @since 1.0.1
     * @description
     * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
     * Otherwise raise error.
     * @example
     * o = new KJUR.asn1.DERObjectIdentifier();
     * o.setValueName("serverAuth");
     */
    this.setValueName = function(oidName) {
        var oid = KJUR.asn1.x509.OID.name2oid(oidName);
        if (oid !== '') {
            this.setValueOidString(oid);
        } else {
            throw "DERObjectIdentifier oidName undefined: " + oidName;
        }
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (params !== undefined) {
        if (typeof params === "string") {
            if (params.match(/^[0-2].[0-9.]+$/)) {
                this.setValueOidString(params);
            } else {
                this.setValueName(params);
            }
        } else if (params.oid !== undefined) {
            this.setValueOidString(params.oid);
        } else if (params.hex !== undefined) {
            this.setValueHex(params.hex);
        } else if (params.name !== undefined) {
            this.setValueName(params.name);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER Enumerated
 * @name KJUR.asn1.DEREnumerated
 * @class class for ASN.1 DER Enumerated
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * @example
 * new KJUR.asn1.DEREnumerated(123);
 * new KJUR.asn1.DEREnumerated({int: 123});
 * new KJUR.asn1.DEREnumerated({hex: '1fad'});
 */
KJUR.asn1.DEREnumerated = function(params) {
    KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
    this.hT = "0a";

    /**
     * set value by Tom Wu's BigInteger object
     * @name setByBigInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {BigInteger} bigIntegerValue to set
     */
    this.setByBigInteger = function(bigIntegerValue) {
        this.hTLV = null;
        this.isModified = true;
        this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
    };

    /**
     * set value by integer value
     * @name setByInteger
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {Integer} integer value to set
     */
    this.setByInteger = function(intValue) {
        var bi = new BigInteger(String(intValue), 10);
        this.setByBigInteger(bi);
    };

    /**
     * set value by integer value
     * @name setValueHex
     * @memberOf KJUR.asn1.DEREnumerated#
     * @function
     * @param {String} hexadecimal string of integer value
     * @description
     * <br/>
     * NOTE: Value shall be represented by minimum octet length of
     * two's complement representation.
     */
    this.setValueHex = function(newHexString) {
        this.hV = newHexString;
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params['int'] != "undefined") {
            this.setByInteger(params['int']);
        } else if (typeof params == "number") {
            this.setByInteger(params);
        } else if (typeof params['hex'] != "undefined") {
            this.setValueHex(params['hex']);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER UTF8String
 * @name KJUR.asn1.DERUTF8String
 * @class class for ASN.1 DER UTF8String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERUTF8String = function(params) {
    KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
    this.hT = "0c";
};
YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER NumericString
 * @name KJUR.asn1.DERNumericString
 * @class class for ASN.1 DER NumericString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERNumericString = function(params) {
    KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
    this.hT = "12";
};
YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER PrintableString
 * @name KJUR.asn1.DERPrintableString
 * @class class for ASN.1 DER PrintableString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERPrintableString = function(params) {
    KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
    this.hT = "13";
};
YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER TeletexString
 * @name KJUR.asn1.DERTeletexString
 * @class class for ASN.1 DER TeletexString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERTeletexString = function(params) {
    KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
    this.hT = "14";
};
YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER IA5String
 * @name KJUR.asn1.DERIA5String
 * @class class for ASN.1 DER IA5String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends KJUR.asn1.DERAbstractString
 * @description
 * @see KJUR.asn1.DERAbstractString - superclass
 */
KJUR.asn1.DERIA5String = function(params) {
    KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
    this.hT = "16";
};
YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER UTCTime
 * @name KJUR.asn1.DERUTCTime
 * @class class for ASN.1 DER UTCTime
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * <h4>EXAMPLES</h4>
 * @example
 * d1 = new KJUR.asn1.DERUTCTime();
 * d1.setString('130430125959Z');
 *
 * d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
 * d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
 * d4 = new KJUR.asn1.DERUTCTime('130430125959Z');
 */
KJUR.asn1.DERUTCTime = function(params) {
    KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
    this.hT = "17";

    /**
     * set value by a Date object<br/>
     * @name setByDate
     * @memberOf KJUR.asn1.DERUTCTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * o = new KJUR.asn1.DERUTCTime();
     * o.setByDate(new Date("2016/12/31"));
     */
    this.setByDate = function(dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'utc');
        this.hV = stohex(this.s);
    };

    this.getFreshValueHex = function() {
        if (typeof this.date == "undefined" && typeof this.s == "undefined") {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'utc');
            this.hV = stohex(this.s);
        }
        return this.hV;
    };

    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        } else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
            this.setString(params);
        } else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        } else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);

// ********************************************************************
/**
 * class for ASN.1 DER GeneralizedTime
 * @name KJUR.asn1.DERGeneralizedTime
 * @class class for ASN.1 DER GeneralizedTime
 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
 * @property {Boolean} withMillis flag to show milliseconds or not
 * @extends KJUR.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
 * </ul>
 * NOTE1: 'params' can be omitted.
 * NOTE2: 'withMillis' property is supported from asn1 1.0.6.
 */
KJUR.asn1.DERGeneralizedTime = function(params) {
    KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
    this.hT = "18";
    this.withMillis = false;

    /**
     * set value by a Date object
     * @name setByDate
     * @memberOf KJUR.asn1.DERGeneralizedTime#
     * @function
     * @param {Date} dateObject Date object to set ASN.1 value(V)
     * @example
     * When you specify UTC time, use 'Date.UTC' method like this:<br/>
     * o1 = new DERUTCTime();
     * o1.setByDate(date);
     *
     * date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
     */
    this.setByDate = function(dateObject) {
        this.hTLV = null;
        this.isModified = true;
        this.date = dateObject;
        this.s = this.formatDate(this.date, 'gen', this.withMillis);
        this.hV = stohex(this.s);
    };

    this.getFreshValueHex = function() {
        if (this.date === undefined && this.s === undefined) {
            this.date = new Date();
            this.s = this.formatDate(this.date, 'gen', this.withMillis);
            this.hV = stohex(this.s);
        }
        return this.hV;
    };

    if (params !== undefined) {
        if (params.str !== undefined) {
            this.setString(params.str);
        } else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
            this.setString(params);
        } else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
        } else if (params.date !== undefined) {
            this.setByDate(params.date);
        }
        if (params.millis === true) {
            this.withMillis = true;
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);

// ********************************************************************
/**
 * class for ASN.1 DER Sequence
 * @name KJUR.asn1.DERSequence
 * @class class for ASN.1 DER Sequence
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
KJUR.asn1.DERSequence = function(params) {
    KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
    this.hT = "30";
    this.getFreshValueHex = function() {
        var h = '';
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            h += asn1Obj.getEncodedHex();
        }
        this.hV = h;
        return this.hV;
    };
};
YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);

// ********************************************************************
/**
 * class for ASN.1 DER Set
 * @name KJUR.asn1.DERSet
 * @class class for ASN.1 DER Set
 * @extends KJUR.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * <li>sortflag - flag for sort (default: true). ASN.1 BER is not sorted in 'SET OF'.</li>
 * </ul>
 * NOTE1: 'params' can be omitted.<br/>
 * NOTE2: sortflag is supported since 1.0.5.
 */
KJUR.asn1.DERSet = function(params) {
    KJUR.asn1.DERSet.superclass.constructor.call(this, params);
    this.hT = "31";
    this.sortFlag = true; // item shall be sorted only in ASN.1 DER
    this.getFreshValueHex = function() {
        var a = new Array();
        for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            a.push(asn1Obj.getEncodedHex());
        }
        if (this.sortFlag == true) a.sort();
        this.hV = a.join('');
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params.sortflag != "undefined" &&
            params.sortflag == false)
            this.sortFlag = false;
    }
};
YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);

// ********************************************************************
/**
 * class for ASN.1 DER TaggedObject
 * @name KJUR.asn1.DERTaggedObject
 * @class class for ASN.1 DER TaggedObject
 * @extends KJUR.asn1.ASN1Object
 * @description
 * <br/>
 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
 * For example, if you find '[1]' tag in a ASN.1 dump,
 * 'tagNoHex' will be 'a1'.
 * <br/>
 * As for optional argument 'params' for constructor, you can specify *ANY* of
 * following properties:
 * <ul>
 * <li>explicit - specify true if this is explicit tag otherwise false
 *     (default is 'true').</li>
 * <li>tag - specify tag (default is 'a0' which means [0])</li>
 * <li>obj - specify ASN1Object which is tagged</li>
 * </ul>
 * @example
 * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
 * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
 * hex = d2.getEncodedHex();
 */
KJUR.asn1.DERTaggedObject = function(params) {
    KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
    this.hT = "a0";
    this.hV = '';
    this.isExplicit = true;
    this.asn1Object = null;

    /**
     * set value by an ASN1Object
     * @name setString
     * @memberOf KJUR.asn1.DERTaggedObject#
     * @function
     * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
     * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
     * @param {ASN1Object} asn1Object ASN.1 to encapsulate
     */
    this.setASN1Object = function(isExplicitFlag, tagNoHex, asn1Object) {
        this.hT = tagNoHex;
        this.isExplicit = isExplicitFlag;
        this.asn1Object = asn1Object;
        if (this.isExplicit) {
            this.hV = this.asn1Object.getEncodedHex();
            this.hTLV = null;
            this.isModified = true;
        } else {
            this.hV = null;
            this.hTLV = asn1Object.getEncodedHex();
            this.hTLV = this.hTLV.replace(/^../, tagNoHex);
            this.isModified = false;
        }
    };

    this.getFreshValueHex = function() {
        return this.hV;
    };

    if (typeof params != "undefined") {
        if (typeof params['tag'] != "undefined") {
            this.hT = params['tag'];
        }
        if (typeof params['explicit'] != "undefined") {
            this.isExplicit = params['explicit'];
        }
        if (typeof params['obj'] != "undefined") {
            this.asn1Object = params['obj'];
            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
        }
    }
};
YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);

/**
 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
 * This object is just a decorator for parsing the key parameter
 * @param {string|Object} key - The key in string format, or an object containing
 * the parameters needed to build a RSAKey object.
 * @constructor
 */
var JSEncryptRSAKey = /** @class */ (function (_super) {
    __extends(JSEncryptRSAKey, _super);
    function JSEncryptRSAKey(key) {
        var _this = _super.call(this) || this;
        // Call the super constructor.
        //  RSAKey.call(this);
        // If a key key was provided.
        if (key) {
            // If this is a string...
            if (typeof key === "string") {
                _this.parseKey(key);
            }
            else if (JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
                JSEncryptRSAKey.hasPublicKeyProperty(key)) {
                // Set the values for the key.
                _this.parsePropertiesFrom(key);
            }
        }
        return _this;
    }
    /**
     * Method to parse a pem encoded string containing both a public or private key.
     * The method will translate the pem encoded string in a der encoded string and
     * will parse private key and public key parameters. This method accepts public key
     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
     *
     * @todo Check how many rsa formats use the same format of pkcs #1.
     *
     * The format is defined as:
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * it's possible to examine the structure of the keys obtained from openssl using
     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
     * @private
     */
    JSEncryptRSAKey.prototype.parseKey = function (pem) {
        try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
            var asn1 = ASN1.decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
                asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
                // Parse the private key.
                modulus = asn1.sub[1].getHexStringValue(); // bigint
                this.n = parseBigInt(modulus, 16);
                public_exponent = asn1.sub[2].getHexStringValue(); // int
                this.e = parseInt(public_exponent, 16);
                var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
                this.d = parseBigInt(private_exponent, 16);
                var prime1 = asn1.sub[4].getHexStringValue(); // bigint
                this.p = parseBigInt(prime1, 16);
                var prime2 = asn1.sub[5].getHexStringValue(); // bigint
                this.q = parseBigInt(prime2, 16);
                var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
                this.dmp1 = parseBigInt(exponent1, 16);
                var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
                this.dmq1 = parseBigInt(exponent2, 16);
                var coefficient = asn1.sub[8].getHexStringValue(); // bigint
                this.coeff = parseBigInt(coefficient, 16);
            }
            else if (asn1.sub.length === 2) {
                // Parse the public key.
                var bit_string = asn1.sub[1];
                var sequence = bit_string.sub[0];
                modulus = sequence.sub[0].getHexStringValue();
                this.n = parseBigInt(modulus, 16);
                public_exponent = sequence.sub[1].getHexStringValue();
                this.e = parseInt(public_exponent, 16);
            }
            else {
                return false;
            }
            return true;
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa key.
     *
     * The translation follow the ASN.1 notation :
     * RSAPrivateKey ::= SEQUENCE {
     *   version           Version,
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER,  -- e
     *   privateExponent   INTEGER,  -- d
     *   prime1            INTEGER,  -- p
     *   prime2            INTEGER,  -- q
     *   exponent1         INTEGER,  -- d mod (p1)
     *   exponent2         INTEGER,  -- d mod (q-1)
     *   coefficient       INTEGER,  -- (inverse of q) mod p
     * }
     * @returns {string}  DER Encoded String representing the rsa private key
     * @private
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
        var options = {
            array: [
                new KJUR.asn1.DERInteger({ int: 0 }),
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e }),
                new KJUR.asn1.DERInteger({ bigint: this.d }),
                new KJUR.asn1.DERInteger({ bigint: this.p }),
                new KJUR.asn1.DERInteger({ bigint: this.q }),
                new KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
                new KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
                new KJUR.asn1.DERInteger({ bigint: this.coeff })
            ]
        };
        var seq = new KJUR.asn1.DERSequence(options);
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
        return hex2b64(this.getPrivateBaseKey());
    };
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa public key.
     * The representation follow the ASN.1 notation :
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * @returns {string} DER Encoded String representing the rsa public key
     * @private
     */
    JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
        var first_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
                new KJUR.asn1.DERNull()
            ]
        });
        var second_sequence = new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERInteger({ bigint: this.n }),
                new KJUR.asn1.DERInteger({ int: this.e })
            ]
        });
        var bit_string = new KJUR.asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex()
        });
        var seq = new KJUR.asn1.DERSequence({
            array: [
                first_sequence,
                bit_string
            ]
        });
        return seq.getEncodedHex();
    };
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
        return hex2b64(this.getPublicBaseKey());
    };
    /**
     * wrap the string in block of width chars. The default value for rsa keys is 64
     * characters.
     * @param {string} str the pem encoded string without header and footer
     * @param {Number} [width=64] - the length the string has to be wrapped at
     * @returns {string}
     * @private
     */
    JSEncryptRSAKey.wordwrap = function (str, width) {
        width = width || 64;
        if (!str) {
            return str;
        }
        var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
        return str.match(RegExp(regex, "g")).join("\n");
    };
    /**
     * Retrieve the pem encoded private key
     * @returns {string} the pem encoded private key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPrivateKey = function () {
        var key = "-----BEGIN RSA PRIVATE KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
        key += "-----END RSA PRIVATE KEY-----";
        return key;
    };
    /**
     * Retrieve the pem encoded public key
     * @returns {string} the pem encoded public key with header/footer
     * @public
     */
    JSEncryptRSAKey.prototype.getPublicKey = function () {
        var key = "-----BEGIN PUBLIC KEY-----\n";
        key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
        key += "-----END PUBLIC KEY-----";
        return key;
    };
    /**
     * Check if the object contains the necessary parameters to populate the rsa modulus
     * and public exponent parameters.
     * @param {Object} [obj={}] - An object that may contain the two public key
     * parameters
     * @returns {boolean} true if the object contains both the modulus and the public exponent
     * properties (n and e)
     * @todo check for types of n and e. N should be a parseable bigInt object, E should
     * be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e"));
    };
    /**
     * Check if the object contains ALL the parameters of an RSA key.
     * @param {Object} [obj={}] - An object that may contain nine rsa key
     * parameters
     * @returns {boolean} true if the object contains all the parameters needed
     * @todo check for types of the parameters all the parameters but the public exponent
     * should be parseable bigint objects, the public exponent should be a parseable integer number
     * @private
     */
    JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
        obj = obj || {};
        return (obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e") &&
            obj.hasOwnProperty("d") &&
            obj.hasOwnProperty("p") &&
            obj.hasOwnProperty("q") &&
            obj.hasOwnProperty("dmp1") &&
            obj.hasOwnProperty("dmq1") &&
            obj.hasOwnProperty("coeff"));
    };
    /**
     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
     * include the modulus and public exponent (n, e) parameters.
     * @param {Object} obj - the object containing rsa parameters
     * @private
     */
    JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
        this.n = obj.n;
        this.e = obj.e;
        if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff;
        }
    };
    return JSEncryptRSAKey;
}(RSAKey));

/**
 *
 * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
 * possible parameters are:
 * - default_key_size        {number}  default: 1024 the key size in bit
 * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
 * - log                     {boolean} default: false whether log warn/error or not
 * @constructor
 */
var JSEncrypt = /** @class */ (function () {
    function JSEncrypt(options) {
        options = options || {};
        this.default_key_size = parseInt(options.default_key_size, 10) || 1024;
        this.default_public_exponent = options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
        this.log = options.log || false;
        // The private and public key.
        this.key = null;
    }
    /**
     * Method to set the rsa key parameter (one method is enough to set both the public
     * and the private key, since the private key contains the public key paramenters)
     * Log a warning if logs are enabled
     * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
     * @public
     */
    JSEncrypt.prototype.setKey = function (key) {
        if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.");
        }
        this.key = new JSEncryptRSAKey(key);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPrivateKey = function (privkey) {
        // Create the key.
        this.setKey(privkey);
    };
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    JSEncrypt.prototype.setPublicKey = function (pubkey) {
        // Sets the public key.
        this.setKey(pubkey);
    };
    /**
     * Proxy method for RSAKey object's decrypt, decrypt the string using the private
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str base64 encoded crypted string to decrypt
     * @return {string} the decrypted string
     * @public
     */
    JSEncrypt.prototype.decrypt = function (str) {
        // Return the decrypted string.
        try {
            return this.getKey().decrypt(b64tohex(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's encrypt, encrypt the string using the public
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str the string to encrypt
     * @return {string} the encrypted string encoded in base64
     * @public
     */
    JSEncrypt.prototype.encrypt = function (str) {
        // Return the encrypted string.
        try {
            return hex2b64(this.getKey().encrypt(str));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's sign.
     * @param {string} str the string to sign
     * @param {function} digestMethod hash method
     * @param {string} digestName the name of the hash algorithm
     * @return {string} the signature encoded in base64
     * @public
     */
    JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
        // return the RSA signature of 'str' in 'hex' format.
        try {
            return hex2b64(this.getKey().sign(str, digestMethod, digestName));
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Proxy method for RSAKey object's verify.
     * @param {string} str the string to verify
     * @param {string} signature the signature encoded in base64 to compare the string to
     * @param {function} digestMethod hash method
     * @return {boolean} whether the data and signature match
     * @public
     */
    JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
        // Return the decrypted 'digest' of the signature.
        try {
            return this.getKey().verify(str, b64tohex(signature), digestMethod);
        }
        catch (ex) {
            return false;
        }
    };
    /**
     * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
     * will be created and returned
     * @param {callback} [cb] the callback to be called if we want the key to be generated
     * in an async fashion
     * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
     * @public
     */
    JSEncrypt.prototype.getKey = function (cb) {
        // Only create new if it does not exist.
        if (!this.key) {
            // Get a new private key.
            this.key = new JSEncryptRSAKey();
            if (cb && {}.toString.call(cb) === "[object Function]") {
                this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
                return;
            }
            // Generate the key.
            this.key.generate(this.default_key_size, this.default_public_exponent);
        }
        return this.key;
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateKey();
    };
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPrivateKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPrivateBaseKeyB64();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITH header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKey = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicKey();
    };
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITHOUT header and footer
     * @public
     */
    JSEncrypt.prototype.getPublicKeyB64 = function () {
        // Return the private representation of this key.
        return this.getKey().getPublicBaseKeyB64();
    };
    JSEncrypt.version = "3.0.0-rc.1";
    return JSEncrypt;
}());

globalThis.JSEncrypt = JSEncrypt;

exports.JSEncrypt = JSEncrypt;
exports.default = JSEncrypt;

Object.defineProperty(exports, '__esModule', { value: true });

})));
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    const base1 = new TextDecoder('windows-1252').decode(new Uint8Array(hashBuffer));                    
    const base = Base64.encode(base1)
    return {hex:hashHex,base64:base};
}
/*
 * [js-sha512]{@link https://github.com/emn178/js-sha512}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2018
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
    'use strict';
  
    var INPUT_ERROR = 'input is invalid type';
    var FINALIZE_ERROR = 'finalize already called';
    var thisEnabled = typeof globalThis === 'object';
    var root = thisEnabled ? globalThis : {};
    if (root.JS_SHA512_NO_globalThis) {
      globalThis = false;
    }
    var WEB_WORKER = !globalThis && typeof globalThis === 'object';
    var NODE_JS = !root.JS_SHA512_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    if (NODE_JS) {
      root = global;
    } else if (WEB_WORKER) {
      root = globalThis;
    }
    var COMMON_JS = !root.JS_SHA512_NO_COMMON_JS && typeof module === 'object' && module.exports;
    var AMD = typeof define === 'function' && define.amd;
    var ARRAY_BUFFER = !root.JS_SHA512_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var EXTRA = [-2147483648, 8388608, 32768, 128];
    var SHIFT = [24, 16, 8, 0];
    var K = [
      0x428A2F98, 0xD728AE22, 0x71374491, 0x23EF65CD,
      0xB5C0FBCF, 0xEC4D3B2F, 0xE9B5DBA5, 0x8189DBBC,
      0x3956C25B, 0xF348B538, 0x59F111F1, 0xB605D019,
      0x923F82A4, 0xAF194F9B, 0xAB1C5ED5, 0xDA6D8118,
      0xD807AA98, 0xA3030242, 0x12835B01, 0x45706FBE,
      0x243185BE, 0x4EE4B28C, 0x550C7DC3, 0xD5FFB4E2,
      0x72BE5D74, 0xF27B896F, 0x80DEB1FE, 0x3B1696B1,
      0x9BDC06A7, 0x25C71235, 0xC19BF174, 0xCF692694,
      0xE49B69C1, 0x9EF14AD2, 0xEFBE4786, 0x384F25E3,
      0x0FC19DC6, 0x8B8CD5B5, 0x240CA1CC, 0x77AC9C65,
      0x2DE92C6F, 0x592B0275, 0x4A7484AA, 0x6EA6E483,
      0x5CB0A9DC, 0xBD41FBD4, 0x76F988DA, 0x831153B5,
      0x983E5152, 0xEE66DFAB, 0xA831C66D, 0x2DB43210,
      0xB00327C8, 0x98FB213F, 0xBF597FC7, 0xBEEF0EE4,
      0xC6E00BF3, 0x3DA88FC2, 0xD5A79147, 0x930AA725,
      0x06CA6351, 0xE003826F, 0x14292967, 0x0A0E6E70,
      0x27B70A85, 0x46D22FFC, 0x2E1B2138, 0x5C26C926,
      0x4D2C6DFC, 0x5AC42AED, 0x53380D13, 0x9D95B3DF,
      0x650A7354, 0x8BAF63DE, 0x766A0ABB, 0x3C77B2A8,
      0x81C2C92E, 0x47EDAEE6, 0x92722C85, 0x1482353B,
      0xA2BFE8A1, 0x4CF10364, 0xA81A664B, 0xBC423001,
      0xC24B8B70, 0xD0F89791, 0xC76C51A3, 0x0654BE30,
      0xD192E819, 0xD6EF5218, 0xD6990624, 0x5565A910,
      0xF40E3585, 0x5771202A, 0x106AA070, 0x32BBD1B8,
      0x19A4C116, 0xB8D2D0C8, 0x1E376C08, 0x5141AB53,
      0x2748774C, 0xDF8EEB99, 0x34B0BCB5, 0xE19B48A8,
      0x391C0CB3, 0xC5C95A63, 0x4ED8AA4A, 0xE3418ACB,
      0x5B9CCA4F, 0x7763E373, 0x682E6FF3, 0xD6B2B8A3,
      0x748F82EE, 0x5DEFB2FC, 0x78A5636F, 0x43172F60,
      0x84C87814, 0xA1F0AB72, 0x8CC70208, 0x1A6439EC,
      0x90BEFFFA, 0x23631E28, 0xA4506CEB, 0xDE82BDE9,
      0xBEF9A3F7, 0xB2C67915, 0xC67178F2, 0xE372532B,
      0xCA273ECE, 0xEA26619C, 0xD186B8C7, 0x21C0C207,
      0xEADA7DD6, 0xCDE0EB1E, 0xF57D4F7F, 0xEE6ED178,
      0x06F067AA, 0x72176FBA, 0x0A637DC5, 0xA2C898A6,
      0x113F9804, 0xBEF90DAE, 0x1B710B35, 0x131C471B,
      0x28DB77F5, 0x23047D84, 0x32CAAB7B, 0x40C72493,
      0x3C9EBE0A, 0x15C9BEBC, 0x431D67C4, 0x9C100D4C,
      0x4CC5D4BE, 0xCB3E42B6, 0x597F299C, 0xFC657E2A,
      0x5FCB6FAB, 0x3AD6FAEC, 0x6C44198C, 0x4A475817
    ];
  
    var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];
  
    var blocks = [];
  
    if (root.JS_SHA512_NO_NODE_JS || !Array.isArray) {
      Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      };
    }
  
    if (ARRAY_BUFFER && (root.JS_SHA512_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
      ArrayBuffer.isView = function (obj) {
        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }
  
    var createOutputMethod = function (outputType, bits) {
      return function (message) {
        return new Sha512(bits, true).update(message)[outputType]();
      };
    };
  
    var createMethod = function (bits) {
      var method = createOutputMethod('hex', bits);
      method.create = function () {
        return new Sha512(bits);
      };
      method.update = function (message) {
        return method.create().update(message);
      };
      for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createOutputMethod(type, bits);
      }
      return method;
    };
  
    var createHmacOutputMethod = function (outputType, bits) {
      return function (key, message) {
        return new HmacSha512(key, bits, true).update(message)[outputType]();
      };
    };
  
    var createHmacMethod = function (bits) {
      var method = createHmacOutputMethod('hex', bits);
      method.create = function (key) {
        return new HmacSha512(key, bits);
      };
      method.update = function (key, message) {
        return method.create(key).update(message);
      };
      for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createHmacOutputMethod(type, bits);
      }
      return method;
    };
  
    function Sha512(bits, sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[1] = blocks[2] = blocks[3] = blocks[4] =
        blocks[5] = blocks[6] = blocks[7] = blocks[8] =
        blocks[9] = blocks[10] = blocks[11] = blocks[12] =
        blocks[13] = blocks[14] = blocks[15] = blocks[16] =
        blocks[17] = blocks[18] = blocks[19] = blocks[20] =
        blocks[21] = blocks[22] = blocks[23] = blocks[24] =
        blocks[25] = blocks[26] = blocks[27] = blocks[28] =
        blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
        this.blocks = blocks;
      } else {
        this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
  
      if (bits == 384) {
        this.h0h = 0xCBBB9D5D;
        this.h0l = 0xC1059ED8;
        this.h1h = 0x629A292A;
        this.h1l = 0x367CD507;
        this.h2h = 0x9159015A;
        this.h2l = 0x3070DD17;
        this.h3h = 0x152FECD8;
        this.h3l = 0xF70E5939;
        this.h4h = 0x67332667;
        this.h4l = 0xFFC00B31;
        this.h5h = 0x8EB44A87;
        this.h5l = 0x68581511;
        this.h6h = 0xDB0C2E0D;
        this.h6l = 0x64F98FA7;
        this.h7h = 0x47B5481D;
        this.h7l = 0xBEFA4FA4;
      } else if (bits == 256) {
        this.h0h = 0x22312194;
        this.h0l = 0xFC2BF72C;
        this.h1h = 0x9F555FA3;
        this.h1l = 0xC84C64C2;
        this.h2h = 0x2393B86B;
        this.h2l = 0x6F53B151;
        this.h3h = 0x96387719;
        this.h3l = 0x5940EABD;
        this.h4h = 0x96283EE2;
        this.h4l = 0xA88EFFE3;
        this.h5h = 0xBE5E1E25;
        this.h5l = 0x53863992;
        this.h6h = 0x2B0199FC;
        this.h6l = 0x2C85B8AA;
        this.h7h = 0x0EB72DDC;
        this.h7l = 0x81C52CA2;
      } else if (bits == 224) {
        this.h0h = 0x8C3D37C8;
        this.h0l = 0x19544DA2;
        this.h1h = 0x73E19966;
        this.h1l = 0x89DCD4D6;
        this.h2h = 0x1DFAB7AE;
        this.h2l = 0x32FF9C82;
        this.h3h = 0x679DD514;
        this.h3l = 0x582F9FCF;
        this.h4h = 0x0F6D2B69;
        this.h4l = 0x7BD44DA8;
        this.h5h = 0x77E36F73;
        this.h5l = 0x04C48942;
        this.h6h = 0x3F9D85A8;
        this.h6l = 0x6A1D36C8;
        this.h7h = 0x1112E6AD;
        this.h7l = 0x91D692A1;
      } else { // 512
        this.h0h = 0x6A09E667;
        this.h0l = 0xF3BCC908;
        this.h1h = 0xBB67AE85;
        this.h1l = 0x84CAA73B;
        this.h2h = 0x3C6EF372;
        this.h2l = 0xFE94F82B;
        this.h3h = 0xA54FF53A;
        this.h3l = 0x5F1D36F1;
        this.h4h = 0x510E527F;
        this.h4l = 0xADE682D1;
        this.h5h = 0x9B05688C;
        this.h5l = 0x2B3E6C1F;
        this.h6h = 0x1F83D9AB;
        this.h6l = 0xFB41BD6B;
        this.h7h = 0x5BE0CD19;
        this.h7l = 0x137E2179;
      }
      this.bits = bits;
  
      this.block = this.start = this.bytes = this.hBytes = 0;
      this.finalized = this.hashed = false;
    }
  
    Sha512.prototype.update = function (message) {
      if (this.finalized) {
        throw new Error(FINALIZE_ERROR);
      }
      var notString, type = typeof message;
      if (type !== 'string') {
        if (type === 'object') {
          if (message === null) {
            throw new Error(INPUT_ERROR);
          } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          } else if (!Array.isArray(message)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
              throw new Error(INPUT_ERROR);
            }
          }
        } else {
          throw new Error(INPUT_ERROR);
        }
        notString = true;
      }
      var code, index = 0, i, length = message.length, blocks = this.blocks;
  
      while (index < length) {
        if (this.hashed) {
          this.hashed = false;
          blocks[0] = this.block;
          blocks[1] = blocks[2] = blocks[3] = blocks[4] =
          blocks[5] = blocks[6] = blocks[7] = blocks[8] =
          blocks[9] = blocks[10] = blocks[11] = blocks[12] =
          blocks[13] = blocks[14] = blocks[15] = blocks[16] =
          blocks[17] = blocks[18] = blocks[19] = blocks[20] =
          blocks[21] = blocks[22] = blocks[23] = blocks[24] =
          blocks[25] = blocks[26] = blocks[27] = blocks[28] =
          blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
        }
  
        if(notString) {
          for (i = this.start; index < length && i < 128; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        } else {
          for (i = this.start; index < length && i < 128; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              blocks[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 0x800) {
              blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else if (code < 0xd800 || code >= 0xe000) {
              blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
              blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            }
          }
        }
  
        this.lastByteIndex = i;
        this.bytes += i - this.start;
        if (i >= 128) {
          this.block = blocks[32];
          this.start = i - 128;
          this.hash();
          this.hashed = true;
        } else {
          this.start = i;
        }
      }
      if (this.bytes > 4294967295) {
        this.hBytes += this.bytes / 4294967296 << 0;
        this.bytes = this.bytes % 4294967296;
      }
      return this;
    };
  
    Sha512.prototype.finalize = function () {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks = this.blocks, i = this.lastByteIndex;
      blocks[32] = this.block;
      blocks[i >> 2] |= EXTRA[i & 3];
      this.block = blocks[32];
      if (i >= 112) {
        if (!this.hashed) {
          this.hash();
        }
        blocks[0] = this.block;
        blocks[1] = blocks[2] = blocks[3] = blocks[4] =
        blocks[5] = blocks[6] = blocks[7] = blocks[8] =
        blocks[9] = blocks[10] = blocks[11] = blocks[12] =
        blocks[13] = blocks[14] = blocks[15] = blocks[16] =
        blocks[17] = blocks[18] = blocks[19] = blocks[20] =
        blocks[21] = blocks[22] = blocks[23] = blocks[24] =
        blocks[25] = blocks[26] = blocks[27] = blocks[28] =
        blocks[29] = blocks[30] = blocks[31] = blocks[32] = 0;
      }
      blocks[30] = this.hBytes << 3 | this.bytes >>> 29;
      blocks[31] = this.bytes << 3;
      this.hash();
    };
  
    Sha512.prototype.hash = function () {
      var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
        h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
        h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
        h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
        blocks = this.blocks, j, s0h, s0l, s1h, s1l, c1, c2, c3, c4,
        abh, abl, dah, dal, cdh, cdl, bch, bcl,
        majh, majl, t1h, t1l, t2h, t2l, chh, chl;
  
      for (j = 32; j < 160; j += 2) {
        t1h = blocks[j - 30];
        t1l = blocks[j - 29];
        s0h = ((t1h >>> 1) | (t1l << 31)) ^ ((t1h >>> 8) | (t1l << 24)) ^ (t1h >>> 7);
        s0l = ((t1l >>> 1) | (t1h << 31)) ^ ((t1l >>> 8) | (t1h << 24)) ^ ((t1l >>> 7) | t1h << 25);
  
        t1h = blocks[j - 4];
        t1l = blocks[j - 3];
        s1h = ((t1h >>> 19) | (t1l << 13)) ^ ((t1l >>> 29) | (t1h << 3)) ^ (t1h >>> 6);
        s1l = ((t1l >>> 19) | (t1h << 13)) ^ ((t1h >>> 29) | (t1l << 3)) ^ ((t1l >>> 6) | t1h << 26);
  
        t1h = blocks[j - 32];
        t1l = blocks[j - 31];
        t2h = blocks[j - 14];
        t2l = blocks[j - 13];
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (s0l & 0xFFFF) + (s1l & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (s0l >>> 16) + (s1l >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (s0h & 0xFFFF) + (s1h & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (s0h >>> 16) + (s1h >>> 16) + (c3 >>> 16);
  
        blocks[j] = (c4 << 16) | (c3 & 0xFFFF);
        blocks[j + 1] = (c2 << 16) | (c1 & 0xFFFF);
      }
  
      var ah = h0h, al = h0l, bh = h1h, bl = h1l, ch = h2h, cl = h2l, dh = h3h, dl = h3l, eh = h4h, el = h4l, fh = h5h, fl = h5l, gh = h6h, gl = h6l, hh = h7h, hl = h7l;
      bch = bh & ch;
      bcl = bl & cl;
      for (j = 0; j < 160; j += 8) {
        s0h = ((ah >>> 28) | (al << 4)) ^ ((al >>> 2) | (ah << 30)) ^ ((al >>> 7) | (ah << 25));
        s0l = ((al >>> 28) | (ah << 4)) ^ ((ah >>> 2) | (al << 30)) ^ ((ah >>> 7) | (al << 25));
  
        s1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((el >>> 9) | (eh << 23));
        s1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((eh >>> 9) | (el << 23));
  
        abh = ah & bh;
        abl = al & bl;
        majh = abh ^ (ah & ch) ^ bch;
        majl = abl ^ (al & cl) ^ bcl;
  
        chh = (eh & fh) ^ (~eh & gh);
        chl = (el & fl) ^ (~el & gl);
  
        t1h = blocks[j];
        t1l = blocks[j + 1];
        t2h = K[j];
        t2l = K[j + 1];
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (hl & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (hl >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (hh >>> 16) + (c3 >>> 16);
  
        t1h = (c4 << 16) | (c3 & 0xFFFF);
        t1l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
        c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
        c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
        c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
  
        t2h = (c4 << 16) | (c3 & 0xFFFF);
        t2l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (dl & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (dl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (dh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (dh >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        hh = (c4 << 16) | (c3 & 0xFFFF);
        hl = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        dh = (c4 << 16) | (c3 & 0xFFFF);
        dl = (c2 << 16) | (c1 & 0xFFFF);
  
        s0h = ((dh >>> 28) | (dl << 4)) ^ ((dl >>> 2) | (dh << 30)) ^ ((dl >>> 7) | (dh << 25));
        s0l = ((dl >>> 28) | (dh << 4)) ^ ((dh >>> 2) | (dl << 30)) ^ ((dh >>> 7) | (dl << 25));
  
        s1h = ((hh >>> 14) | (hl << 18)) ^ ((hh >>> 18) | (hl << 14)) ^ ((hl >>> 9) | (hh << 23));
        s1l = ((hl >>> 14) | (hh << 18)) ^ ((hl >>> 18) | (hh << 14)) ^ ((hh >>> 9) | (hl << 23));
  
        dah = dh & ah;
        dal = dl & al;
        majh = dah ^ (dh & bh) ^ abh;
        majl = dal ^ (dl & bl) ^ abl;
  
        chh = (hh & eh) ^ (~hh & fh);
        chl = (hl & el) ^ (~hl & fl);
  
        t1h = blocks[j + 2];
        t1l = blocks[j + 3];
        t2h = K[j + 2];
        t2l = K[j + 3];
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (gl & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (gl >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (gh >>> 16) + (c3 >>> 16);
  
        t1h = (c4 << 16) | (c3 & 0xFFFF);
        t1l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
        c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
        c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
        c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
  
        t2h = (c4 << 16) | (c3 & 0xFFFF);
        t2l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (cl & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (cl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (ch & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (ch >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        gh = (c4 << 16) | (c3 & 0xFFFF);
        gl = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        ch = (c4 << 16) | (c3 & 0xFFFF);
        cl = (c2 << 16) | (c1 & 0xFFFF);
  
        s0h = ((ch >>> 28) | (cl << 4)) ^ ((cl >>> 2) | (ch << 30)) ^ ((cl >>> 7) | (ch << 25));
        s0l = ((cl >>> 28) | (ch << 4)) ^ ((ch >>> 2) | (cl << 30)) ^ ((ch >>> 7) | (cl << 25));
  
        s1h = ((gh >>> 14) | (gl << 18)) ^ ((gh >>> 18) | (gl << 14)) ^ ((gl >>> 9) | (gh << 23));
        s1l = ((gl >>> 14) | (gh << 18)) ^ ((gl >>> 18) | (gh << 14)) ^ ((gh >>> 9) | (gl << 23));
  
        cdh = ch & dh;
        cdl = cl & dl;
        majh = cdh ^ (ch & ah) ^ dah;
        majl = cdl ^ (cl & al) ^ dal;
  
        chh = (gh & hh) ^ (~gh & eh);
        chl = (gl & hl) ^ (~gl & el);
  
        t1h = blocks[j + 4];
        t1l = blocks[j + 5];
        t2h = K[j + 4];
        t2l = K[j + 5];
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (fl & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (fl >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (fh >>> 16) + (c3 >>> 16);
  
        t1h = (c4 << 16) | (c3 & 0xFFFF);
        t1l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
        c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
        c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
        c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
  
        t2h = (c4 << 16) | (c3 & 0xFFFF);
        t2l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (bl & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (bl >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (bh & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (bh >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        fh = (c4 << 16) | (c3 & 0xFFFF);
        fl = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        bh = (c4 << 16) | (c3 & 0xFFFF);
        bl = (c2 << 16) | (c1 & 0xFFFF);
  
        s0h = ((bh >>> 28) | (bl << 4)) ^ ((bl >>> 2) | (bh << 30)) ^ ((bl >>> 7) | (bh << 25));
        s0l = ((bl >>> 28) | (bh << 4)) ^ ((bh >>> 2) | (bl << 30)) ^ ((bh >>> 7) | (bl << 25));
  
        s1h = ((fh >>> 14) | (fl << 18)) ^ ((fh >>> 18) | (fl << 14)) ^ ((fl >>> 9) | (fh << 23));
        s1l = ((fl >>> 14) | (fh << 18)) ^ ((fl >>> 18) | (fh << 14)) ^ ((fh >>> 9) | (fl << 23));
  
        bch = bh & ch;
        bcl = bl & cl;
        majh = bch ^ (bh & dh) ^ cdh;
        majl = bcl ^ (bl & dl) ^ cdl;
  
        chh = (fh & gh) ^ (~fh & hh);
        chl = (fl & gl) ^ (~fl & hl);
  
        t1h = blocks[j + 6];
        t1l = blocks[j + 7];
        t2h = K[j + 6];
        t2l = K[j + 7];
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF) + (chl & 0xFFFF) + (s1l & 0xFFFF) + (el & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (chl >>> 16) + (s1l >>> 16) + (el >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (chh & 0xFFFF) + (s1h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (chh >>> 16) + (s1h >>> 16) + (eh >>> 16) + (c3 >>> 16);
  
        t1h = (c4 << 16) | (c3 & 0xFFFF);
        t1l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (majl & 0xFFFF) + (s0l & 0xFFFF);
        c2 = (majl >>> 16) + (s0l >>> 16) + (c1 >>> 16);
        c3 = (majh & 0xFFFF) + (s0h & 0xFFFF) + (c2 >>> 16);
        c4 = (majh >>> 16) + (s0h >>> 16) + (c3 >>> 16);
  
        t2h = (c4 << 16) | (c3 & 0xFFFF);
        t2l = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (al & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (al >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (ah & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (ah >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        eh = (c4 << 16) | (c3 & 0xFFFF);
        el = (c2 << 16) | (c1 & 0xFFFF);
  
        c1 = (t2l & 0xFFFF) + (t1l & 0xFFFF);
        c2 = (t2l >>> 16) + (t1l >>> 16) + (c1 >>> 16);
        c3 = (t2h & 0xFFFF) + (t1h & 0xFFFF) + (c2 >>> 16);
        c4 = (t2h >>> 16) + (t1h >>> 16) + (c3 >>> 16);
  
        ah = (c4 << 16) | (c3 & 0xFFFF);
        al = (c2 << 16) | (c1 & 0xFFFF);
      }
  
      c1 = (h0l & 0xFFFF) + (al & 0xFFFF);
      c2 = (h0l >>> 16) + (al >>> 16) + (c1 >>> 16);
      c3 = (h0h & 0xFFFF) + (ah & 0xFFFF) + (c2 >>> 16);
      c4 = (h0h >>> 16) + (ah >>> 16) + (c3 >>> 16);
  
      this.h0h = (c4 << 16) | (c3 & 0xFFFF);
      this.h0l = (c2 << 16) | (c1 & 0xFFFF);
  
      c1 = (h1l & 0xFFFF) + (bl & 0xFFFF);
      c2 = (h1l >>> 16) + (bl >>> 16) + (c1 >>> 16);
      c3 = (h1h & 0xFFFF) + (bh & 0xFFFF) + (c2 >>> 16);
      c4 = (h1h >>> 16) + (bh >>> 16) + (c3 >>> 16);
  
      this.h1h = (c4 << 16) | (c3 & 0xFFFF);
      this.h1l = (c2 << 16) | (c1 & 0xFFFF);
  
      c1 = (h2l & 0xFFFF) + (cl & 0xFFFF);
      c2 = (h2l >>> 16) + (cl >>> 16) + (c1 >>> 16);
      c3 = (h2h & 0xFFFF) + (ch & 0xFFFF) + (c2 >>> 16);
      c4 = (h2h >>> 16) + (ch >>> 16) + (c3 >>> 16);
  
      this.h2h = (c4 << 16) | (c3 & 0xFFFF);
      this.h2l = (c2 << 16) | (c1 & 0xFFFF);
  
      c1 = (h3l & 0xFFFF) + (dl & 0xFFFF);
      c2 = (h3l >>> 16) + (dl >>> 16) + (c1 >>> 16);
      c3 = (h3h & 0xFFFF) + (dh & 0xFFFF) + (c2 >>> 16);
      c4 = (h3h >>> 16) + (dh >>> 16) + (c3 >>> 16);
  
      this.h3h = (c4 << 16) | (c3 & 0xFFFF);
      this.h3l = (c2 << 16) | (c1 & 0xFFFF);
  
      c1 = (h4l & 0xFFFF) + (el & 0xFFFF);
      c2 = (h4l >>> 16) + (el >>> 16) + (c1 >>> 16);
      c3 = (h4h & 0xFFFF) + (eh & 0xFFFF) + (c2 >>> 16);
      c4 = (h4h >>> 16) + (eh >>> 16) + (c3 >>> 16);
  
      this.h4h = (c4 << 16) | (c3 & 0xFFFF);
      this.h4l = (c2 << 16) | (c1 & 0xFFFF);
  
      c1 = (h5l & 0xFFFF) + (fl & 0xFFFF);
      c2 = (h5l >>> 16) + (fl >>> 16) + (c1 >>> 16);
      c3 = (h5h & 0xFFFF) + (fh & 0xFFFF) + (c2 >>> 16);
      c4 = (h5h >>> 16) + (fh >>> 16) + (c3 >>> 16);
  
      this.h5h = (c4 << 16) | (c3 & 0xFFFF);
      this.h5l = (c2 << 16) | (c1 & 0xFFFF);
  
      c1 = (h6l & 0xFFFF) + (gl & 0xFFFF);
      c2 = (h6l >>> 16) + (gl >>> 16) + (c1 >>> 16);
      c3 = (h6h & 0xFFFF) + (gh & 0xFFFF) + (c2 >>> 16);
      c4 = (h6h >>> 16) + (gh >>> 16) + (c3 >>> 16);
  
      this.h6h = (c4 << 16) | (c3 & 0xFFFF);
      this.h6l = (c2 << 16) | (c1 & 0xFFFF);
  
      c1 = (h7l & 0xFFFF) + (hl & 0xFFFF);
      c2 = (h7l >>> 16) + (hl >>> 16) + (c1 >>> 16);
      c3 = (h7h & 0xFFFF) + (hh & 0xFFFF) + (c2 >>> 16);
      c4 = (h7h >>> 16) + (hh >>> 16) + (c3 >>> 16);
  
      this.h7h = (c4 << 16) | (c3 & 0xFFFF);
      this.h7l = (c2 << 16) | (c1 & 0xFFFF);
    };
  
    Sha512.prototype.hex = function () {
      this.finalize();
  
      var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
        h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
        h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
        h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
        bits = this.bits;
  
      var hex = HEX_CHARS[(h0h >> 28) & 0x0F] + HEX_CHARS[(h0h >> 24) & 0x0F] +
        HEX_CHARS[(h0h >> 20) & 0x0F] + HEX_CHARS[(h0h >> 16) & 0x0F] +
        HEX_CHARS[(h0h >> 12) & 0x0F] + HEX_CHARS[(h0h >> 8) & 0x0F] +
        HEX_CHARS[(h0h >> 4) & 0x0F] + HEX_CHARS[h0h & 0x0F] +
        HEX_CHARS[(h0l >> 28) & 0x0F] + HEX_CHARS[(h0l >> 24) & 0x0F] +
        HEX_CHARS[(h0l >> 20) & 0x0F] + HEX_CHARS[(h0l >> 16) & 0x0F] +
        HEX_CHARS[(h0l >> 12) & 0x0F] + HEX_CHARS[(h0l >> 8) & 0x0F] +
        HEX_CHARS[(h0l >> 4) & 0x0F] + HEX_CHARS[h0l & 0x0F] +
        HEX_CHARS[(h1h >> 28) & 0x0F] + HEX_CHARS[(h1h >> 24) & 0x0F] +
        HEX_CHARS[(h1h >> 20) & 0x0F] + HEX_CHARS[(h1h >> 16) & 0x0F] +
        HEX_CHARS[(h1h >> 12) & 0x0F] + HEX_CHARS[(h1h >> 8) & 0x0F] +
        HEX_CHARS[(h1h >> 4) & 0x0F] + HEX_CHARS[h1h & 0x0F] +
        HEX_CHARS[(h1l >> 28) & 0x0F] + HEX_CHARS[(h1l >> 24) & 0x0F] +
        HEX_CHARS[(h1l >> 20) & 0x0F] + HEX_CHARS[(h1l >> 16) & 0x0F] +
        HEX_CHARS[(h1l >> 12) & 0x0F] + HEX_CHARS[(h1l >> 8) & 0x0F] +
        HEX_CHARS[(h1l >> 4) & 0x0F] + HEX_CHARS[h1l & 0x0F] +
        HEX_CHARS[(h2h >> 28) & 0x0F] + HEX_CHARS[(h2h >> 24) & 0x0F] +
        HEX_CHARS[(h2h >> 20) & 0x0F] + HEX_CHARS[(h2h >> 16) & 0x0F] +
        HEX_CHARS[(h2h >> 12) & 0x0F] + HEX_CHARS[(h2h >> 8) & 0x0F] +
        HEX_CHARS[(h2h >> 4) & 0x0F] + HEX_CHARS[h2h & 0x0F] +
        HEX_CHARS[(h2l >> 28) & 0x0F] + HEX_CHARS[(h2l >> 24) & 0x0F] +
        HEX_CHARS[(h2l >> 20) & 0x0F] + HEX_CHARS[(h2l >> 16) & 0x0F] +
        HEX_CHARS[(h2l >> 12) & 0x0F] + HEX_CHARS[(h2l >> 8) & 0x0F] +
        HEX_CHARS[(h2l >> 4) & 0x0F] + HEX_CHARS[h2l & 0x0F] +
        HEX_CHARS[(h3h >> 28) & 0x0F] + HEX_CHARS[(h3h >> 24) & 0x0F] +
        HEX_CHARS[(h3h >> 20) & 0x0F] + HEX_CHARS[(h3h >> 16) & 0x0F] +
        HEX_CHARS[(h3h >> 12) & 0x0F] + HEX_CHARS[(h3h >> 8) & 0x0F] +
        HEX_CHARS[(h3h >> 4) & 0x0F] + HEX_CHARS[h3h & 0x0F];
      if (bits >= 256) {
        hex += HEX_CHARS[(h3l >> 28) & 0x0F] + HEX_CHARS[(h3l >> 24) & 0x0F] +
          HEX_CHARS[(h3l >> 20) & 0x0F] + HEX_CHARS[(h3l >> 16) & 0x0F] +
          HEX_CHARS[(h3l >> 12) & 0x0F] + HEX_CHARS[(h3l >> 8) & 0x0F] +
          HEX_CHARS[(h3l >> 4) & 0x0F] + HEX_CHARS[h3l & 0x0F];
      }
      if (bits >= 384) {
        hex += HEX_CHARS[(h4h >> 28) & 0x0F] + HEX_CHARS[(h4h >> 24) & 0x0F] +
          HEX_CHARS[(h4h >> 20) & 0x0F] + HEX_CHARS[(h4h >> 16) & 0x0F] +
          HEX_CHARS[(h4h >> 12) & 0x0F] + HEX_CHARS[(h4h >> 8) & 0x0F] +
          HEX_CHARS[(h4h >> 4) & 0x0F] + HEX_CHARS[h4h & 0x0F] +
          HEX_CHARS[(h4l >> 28) & 0x0F] + HEX_CHARS[(h4l >> 24) & 0x0F] +
          HEX_CHARS[(h4l >> 20) & 0x0F] + HEX_CHARS[(h4l >> 16) & 0x0F] +
          HEX_CHARS[(h4l >> 12) & 0x0F] + HEX_CHARS[(h4l >> 8) & 0x0F] +
          HEX_CHARS[(h4l >> 4) & 0x0F] + HEX_CHARS[h4l & 0x0F] +
          HEX_CHARS[(h5h >> 28) & 0x0F] + HEX_CHARS[(h5h >> 24) & 0x0F] +
          HEX_CHARS[(h5h >> 20) & 0x0F] + HEX_CHARS[(h5h >> 16) & 0x0F] +
          HEX_CHARS[(h5h >> 12) & 0x0F] + HEX_CHARS[(h5h >> 8) & 0x0F] +
          HEX_CHARS[(h5h >> 4) & 0x0F] + HEX_CHARS[h5h & 0x0F] +
          HEX_CHARS[(h5l >> 28) & 0x0F] + HEX_CHARS[(h5l >> 24) & 0x0F] +
          HEX_CHARS[(h5l >> 20) & 0x0F] + HEX_CHARS[(h5l >> 16) & 0x0F] +
          HEX_CHARS[(h5l >> 12) & 0x0F] + HEX_CHARS[(h5l >> 8) & 0x0F] +
          HEX_CHARS[(h5l >> 4) & 0x0F] + HEX_CHARS[h5l & 0x0F];
      }
      if (bits == 512) {
        hex += HEX_CHARS[(h6h >> 28) & 0x0F] + HEX_CHARS[(h6h >> 24) & 0x0F] +
          HEX_CHARS[(h6h >> 20) & 0x0F] + HEX_CHARS[(h6h >> 16) & 0x0F] +
          HEX_CHARS[(h6h >> 12) & 0x0F] + HEX_CHARS[(h6h >> 8) & 0x0F] +
          HEX_CHARS[(h6h >> 4) & 0x0F] + HEX_CHARS[h6h & 0x0F] +
          HEX_CHARS[(h6l >> 28) & 0x0F] + HEX_CHARS[(h6l >> 24) & 0x0F] +
          HEX_CHARS[(h6l >> 20) & 0x0F] + HEX_CHARS[(h6l >> 16) & 0x0F] +
          HEX_CHARS[(h6l >> 12) & 0x0F] + HEX_CHARS[(h6l >> 8) & 0x0F] +
          HEX_CHARS[(h6l >> 4) & 0x0F] + HEX_CHARS[h6l & 0x0F] +
          HEX_CHARS[(h7h >> 28) & 0x0F] + HEX_CHARS[(h7h >> 24) & 0x0F] +
          HEX_CHARS[(h7h >> 20) & 0x0F] + HEX_CHARS[(h7h >> 16) & 0x0F] +
          HEX_CHARS[(h7h >> 12) & 0x0F] + HEX_CHARS[(h7h >> 8) & 0x0F] +
          HEX_CHARS[(h7h >> 4) & 0x0F] + HEX_CHARS[h7h & 0x0F] +
          HEX_CHARS[(h7l >> 28) & 0x0F] + HEX_CHARS[(h7l >> 24) & 0x0F] +
          HEX_CHARS[(h7l >> 20) & 0x0F] + HEX_CHARS[(h7l >> 16) & 0x0F] +
          HEX_CHARS[(h7l >> 12) & 0x0F] + HEX_CHARS[(h7l >> 8) & 0x0F] +
          HEX_CHARS[(h7l >> 4) & 0x0F] + HEX_CHARS[h7l & 0x0F];
      }
      return hex;
    };
  
    Sha512.prototype.toString = Sha512.prototype.hex;
  
    Sha512.prototype.digest = function () {
      this.finalize();
  
      var h0h = this.h0h, h0l = this.h0l, h1h = this.h1h, h1l = this.h1l,
        h2h = this.h2h, h2l = this.h2l, h3h = this.h3h, h3l = this.h3l,
        h4h = this.h4h, h4l = this.h4l, h5h = this.h5h, h5l = this.h5l,
        h6h = this.h6h, h6l = this.h6l, h7h = this.h7h, h7l = this.h7l,
        bits = this.bits;
  
      var arr = [
        (h0h >> 24) & 0xFF, (h0h >> 16) & 0xFF, (h0h >> 8) & 0xFF, h0h & 0xFF,
        (h0l >> 24) & 0xFF, (h0l >> 16) & 0xFF, (h0l >> 8) & 0xFF, h0l & 0xFF,
        (h1h >> 24) & 0xFF, (h1h >> 16) & 0xFF, (h1h >> 8) & 0xFF, h1h & 0xFF,
        (h1l >> 24) & 0xFF, (h1l >> 16) & 0xFF, (h1l >> 8) & 0xFF, h1l & 0xFF,
        (h2h >> 24) & 0xFF, (h2h >> 16) & 0xFF, (h2h >> 8) & 0xFF, h2h & 0xFF,
        (h2l >> 24) & 0xFF, (h2l >> 16) & 0xFF, (h2l >> 8) & 0xFF, h2l & 0xFF,
        (h3h >> 24) & 0xFF, (h3h >> 16) & 0xFF, (h3h >> 8) & 0xFF, h3h & 0xFF
      ];
  
      if (bits >= 256) {
        arr.push((h3l >> 24) & 0xFF, (h3l >> 16) & 0xFF, (h3l >> 8) & 0xFF, h3l & 0xFF);
      }
      if (bits >= 384) {
        arr.push(
          (h4h >> 24) & 0xFF, (h4h >> 16) & 0xFF, (h4h >> 8) & 0xFF, h4h & 0xFF,
          (h4l >> 24) & 0xFF, (h4l >> 16) & 0xFF, (h4l >> 8) & 0xFF, h4l & 0xFF,
          (h5h >> 24) & 0xFF, (h5h >> 16) & 0xFF, (h5h >> 8) & 0xFF, h5h & 0xFF,
          (h5l >> 24) & 0xFF, (h5l >> 16) & 0xFF, (h5l >> 8) & 0xFF, h5l & 0xFF
        );
      }
      if (bits == 512) {
        arr.push(
          (h6h >> 24) & 0xFF, (h6h >> 16) & 0xFF, (h6h >> 8) & 0xFF, h6h & 0xFF,
          (h6l >> 24) & 0xFF, (h6l >> 16) & 0xFF, (h6l >> 8) & 0xFF, h6l & 0xFF,
          (h7h >> 24) & 0xFF, (h7h >> 16) & 0xFF, (h7h >> 8) & 0xFF, h7h & 0xFF,
          (h7l >> 24) & 0xFF, (h7l >> 16) & 0xFF, (h7l >> 8) & 0xFF, h7l & 0xFF
        );
      }
      return arr;
    };
  
    Sha512.prototype.array = Sha512.prototype.digest;
  
    Sha512.prototype.arrayBuffer = function () {
      this.finalize();
  
      var bits = this.bits;
      var buffer = new ArrayBuffer(bits / 8);
      var dataView = new DataView(buffer);
      dataView.setUint32(0, this.h0h);
      dataView.setUint32(4, this.h0l);
      dataView.setUint32(8, this.h1h);
      dataView.setUint32(12, this.h1l);
      dataView.setUint32(16, this.h2h);
      dataView.setUint32(20, this.h2l);
      dataView.setUint32(24, this.h3h);
  
      if (bits >= 256) {
        dataView.setUint32(28, this.h3l);
      }
      if (bits >= 384) {
        dataView.setUint32(32, this.h4h);
        dataView.setUint32(36, this.h4l);
        dataView.setUint32(40, this.h5h);
        dataView.setUint32(44, this.h5l);
      }
      if (bits == 512) {
        dataView.setUint32(48, this.h6h);
        dataView.setUint32(52, this.h6l);
        dataView.setUint32(56, this.h7h);
        dataView.setUint32(60, this.h7l);
      }
      return buffer;
    };
  
    Sha512.prototype.clone = function () {
      var hash = new Sha512(this.bits, false);
      this.copyTo(hash);
      return hash;
    };
  
    Sha512.prototype.copyTo = function (hash) {
      var i = 0, attrs = [
        'h0h', 'h0l', 'h1h', 'h1l', 'h2h', 'h2l', 'h3h', 'h3l', 'h4h', 'h4l', 'h5h', 'h5l', 'h6h', 'h6l', 'h7h', 'h7l',
        'start', 'bytes', 'hBytes', 'finalized', 'hashed', 'lastByteIndex'
      ];
      for (i = 0; i < attrs.length; ++i) {
        hash[attrs[i]] = this[attrs[i]];
      }
      for (i = 0; i < this.blocks.length; ++i) {
        hash.blocks[i] = this.blocks[i];
      }
    };
  
    function HmacSha512(key, bits, sharedMemory) {
      var notString, type = typeof key;
      if (type !== 'string') {
        if (type === 'object') {
          if (key === null) {
            throw new Error(INPUT_ERROR);
          } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
            key = new Uint8Array(key);
          } else if (!Array.isArray(key)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
              throw new Error(INPUT_ERROR);
            }
          }
        } else {
          throw new Error(INPUT_ERROR);
        }
        notString = true;
      }
      var length = key.length;
      if (!notString) {
        var bytes = [], length = key.length, index = 0, code;
        for (var i = 0; i < length; ++i) {
          code = key.charCodeAt(i);
          if (code < 0x80) {
            bytes[index++] = code;
          } else if (code < 0x800) {
            bytes[index++] = (0xc0 | (code >> 6));
            bytes[index++] = (0x80 | (code & 0x3f));
          } else if (code < 0xd800 || code >= 0xe000) {
            bytes[index++] = (0xe0 | (code >> 12));
            bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
            bytes[index++] = (0x80 | (code & 0x3f));
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
            bytes[index++] = (0xf0 | (code >> 18));
            bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
            bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
            bytes[index++] = (0x80 | (code & 0x3f));
          }
        }
        key = bytes;
      }
  
      if (key.length > 128) {
        key = (new Sha512(bits, true)).update(key).array();
      }
  
      var oKeyPad = [], iKeyPad = [];
      for (var i = 0; i < 128; ++i) {
        var b = key[i] || 0;
        oKeyPad[i] = 0x5c ^ b;
        iKeyPad[i] = 0x36 ^ b;
      }
  
      Sha512.call(this, bits, sharedMemory);
  
      this.update(iKeyPad);
      this.oKeyPad = oKeyPad;
      this.inner = true;
      this.sharedMemory = sharedMemory;
    }
    HmacSha512.prototype = new Sha512();
  
    HmacSha512.prototype.finalize = function () {
      Sha512.prototype.finalize.call(this);
      if (this.inner) {
        this.inner = false;
        var innerHash = this.array();
        Sha512.call(this, this.bits, this.sharedMemory);
        this.update(this.oKeyPad);
        this.update(innerHash);
        Sha512.prototype.finalize.call(this);
      }
    };
  
    HmacSha512.prototype.clone = function () {
      var hash = new HmacSha512([], this.bits, false);
      this.copyTo(hash);
      hash.inner = this.inner;
      for (var i = 0; i < this.oKeyPad.length; ++i) {
        hash.oKeyPad[i] = this.oKeyPad[i];
      }
      return hash;
    };
  
    var exports = createMethod(512);
    exports.sha512 = exports;
    exports.sha384 = createMethod(384);
    exports.sha512_256 = createMethod(256);
    exports.sha512_224 = createMethod(224);
    exports.sha512.hmac = createHmacMethod(512);
    exports.sha384.hmac = createHmacMethod(384);
    exports.sha512_256.hmac = createHmacMethod(256);
    exports.sha512_224.hmac = createHmacMethod(224);
  
    if (COMMON_JS) {
      module.exports = exports;
    } else {
      root.sha512 = exports.sha512;
      root.sha384 = exports.sha384;
      root.sha512_256 = exports.sha512_256;
      root.sha512_224 = exports.sha512_224;
      if (AMD) {
        define(function () {
          return exports;
        });
      }
    }
  })();
