"use strict";

const sprintf = require("sprintf-js").sprintf;
const packet_analyzer = require("node-opcua-packet-analyzer").packet_analyzer;
const MessageBuilder = require("../src/message_builder").MessageBuilder;
const messageHeaderToString = require("../src/message_header_to_string").messageHeaderToString;
/**
 *
 * @param packets
 */
function verify_multi_chunk_message(packets) {

    const messageBuilder = new MessageBuilder();
    messageBuilder.setSecurity('NONE', 'None');

    messageBuilder.on("full_message_body", function (full_message_body) {
        console.log("full_message_body received:");
        packet_analyzer(full_message_body);
    });
    messageBuilder.on("start_chunk", function (info, data) {
        console.log(" starting new chunk ", info.messageHeader);
    });

    messageBuilder.on("chunk", function (messageChunk) {
        console.log(messageHeaderToString(messageChunk));
    });

    let total_length = 0;
    packets.forEach(function (packet) {
        if (packet instanceof Array) {
            packet = Buffer.from(packet);
        }
        total_length += packet.length;
        console.log(sprintf(" adding packet size : %5d l=%d", packet.length, total_length));
        messageBuilder.feed(packet);
    });
}

function verify_single_chunk_message(packet) {
    verify_multi_chunk_message([packet]);
}

exports.verify_multi_chunk_message = verify_multi_chunk_message;
exports.verify_single_chunk_message = verify_single_chunk_message;
