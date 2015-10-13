# Kafka NodeJS Client Test

Its a simple start point to have all needed code working in a nutshell.

It uses the lib from https://github.com/SOHU-Co/kafka-node, and a mix of their provided examples.

This code was made only for testing purposes.

Kafka installation was made using this tutorial: https://www.digitalocean.com/community/tutorials/how-to-install-apache-kafka-on-ubuntu-14-04

### To Create a Topic
```
./kafka/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 2 --topic KAFKAJSTests
```

### To Consume

Fire consumers (at most to the number of partitions you have) this way:

```
KAFKACLUSTER=localhost node consumer.js [topic] [groupId] [partition]
```
All parameters have default values, so you can simply run:
```
node consumer.js
```
It will connect to localhost, topic TutorialTopic, partition 0 in a group called kafka-node-group, and start a consuming loop.

### To Produce

Fire producers this way:

```
KAFKACLUSTER=localhost node producer.js [topic] [partition] [message_key] [message]
```
All parameters have default values, so you can simply run:
```
node producer.js
```
It will connect to localhost, topic TutorialTopic, partition 0. Will send a message with a key of 'some_key', and a message 'some_message', then will get back to shell prompt.
