#!/bin/sh

# set hostname from args
HOST=$1

# set type (random or preset)
TYPE=$2

add_activity()
{
  TITLE=$1
  DESCRIPTION=$2
  echo curl -X POST -H 'Content-Type: application/json' -d "{\"title\":\"${TITLE}\", \"description\":\"${DESCRIPTION}\"}" "${HOST}/activities"
}

add_relationship()
{
  # url encode the titles (from https://stackoverflow.com/a/10797966)
  A1=`echo -n "$1" | curl -Gso /dev/null -w %{url_effective} --data-urlencode @- "" | cut -c 3-`
  A2=`echo -n "$2" | curl -Gso /dev/null -w %{url_effective} --data-urlencode @- "" | cut -c 3-`
  echo curl -X GET "${HOST}/addRelationship?a1Title=${A1}&a2Title=${A2}"
}

if [ "${TYPE}" = "random" ]
then
  echo "Generating random graph..."
  MAX_NODES=30
  MIN_NODES=10
  NUM_NODES=`shuf -i ${MIN_NODES}-${MAX_NODES} | head -n1`
  for i in `seq 1 ${NUM_NODES}`
  do
    NAME="Activity ${i}"
    DESCRIPTION="${NAME}"
    add_activity "${NAME}" "${DESCRIPTION}"
  done
  # add relationships after the activities are created
  for i in `seq 1 ${NUM_NODES}`
  do
    # add random number of relationships
    RLEN=`shuf -i 1-${NUM_NODES} | head -n1`
    for j in `shuf -i 1-${NUM_NODES} | head -n ${RLEN}`
    do
      if [ ${j} -eq ${i} ]
      then
        add_relationship "${NAME}" "Activity ${j}"
      fi
    done
  done
elif [ "${TYPE}" = "preset" ]
then
  echo "Generating preset graph..."
  MODE=''
  IFS=''
  cat preset.txt |
  while read line
  do
    if [ -z "${line}" ]
    then
      continue
    elif [ "${line}" = "#ACTIVITIES" ]
    then
      MODE='a'
      continue
    elif [ "${line}" = "#RELATIONSHIPS" ]
    then
      MODE='r'
      continue
    fi
    if [ "${MODE}" = "a" ]
    then
      add_activity "${line}" "${line}"
    elif [ "${MODE}" = "r" ]
    then
      A1=`echo ${line} | cut -d, -f1`
      A2=`echo ${line} | cut -d, -f2`
      add_relationship "${A1}" "${A2}"
    fi
  done
fi
