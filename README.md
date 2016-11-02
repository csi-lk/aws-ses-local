# aws-ses-local

[![Build Status](https://travis-ci.org/Si1kIfY/aws-ses-local.svg?branch=master)](https://travis-ci.org/Si1kIfY/aws-ses-local) [![Coverage Status](https://coveralls.io/repos/github/Si1kIfY/aws-ses-local/badge.svg?branch=master)](https://coveralls.io/github/Si1kIfY/aws-ses-local?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/si1kify/aws-ses-local/badge.svg)](https://snyk.io/test/github/si1kify/aws-ses-local) [![scrutinizer](https://img.shields.io/scrutinizer/g/Si1kIfY/aws-ses-local.svg)](https://scrutinizer-ci.com/g/Si1kIfY/aws-ses-local/) [![npm package](https://img.shields.io/npm/v/aws-ses-local.svg)](https://www.npmjs.com/package/aws-ses-local) [![repo license](https://img.shields.io/github/license/Si1kIfY/aws-ses-local.svg)](https://github.com/Si1kIfY/aws-ses-local/blob/master/LICENSE) 

Creates local [Amazon Simple Email Service](https://aws.amazon.com/ses/) Server for consuming requests sent by the API

# Features

* Stores html / text email and headers to output directory for viewing / testing
* Returns file url of html email in place of MessageId

## Supported Functions
  * [sendEmail(params = {}, callback)](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property)

# Installation

```
npm install aws-ses-local -g
```

# Running the server

```
aws-ses-local
```

## CLI Options

| Option  | Short Option | Default | Description |
| --- | --- | --- | --- | 
| `--outputDir` | `-o` | `./output` | Specify output directory |
| `--port` | `-p` | `9001` | Specify port for server to run on |
| `--clean` | `-c` | none | Clean output directory (delete all contents) |

# Using the server

First, you need to install the [AWS SDK](http://aws.amazon.com/sdkfornodejs) then point it to the local server by specifying the `endpoint`

```
import AWS from 'aws-sdk'
const ses = new AWS.SES({ region: 'us-east-1', endpoint: 'http://localhost:9001' })
```

That's it! Now run `sendEmail()` with required params for eg.

```
ses.sendEmail({
  Destination: { /* required */
    BccAddresses: [
      'STRING_VALUE'
    ],
    CcAddresses: [
      'STRING_VALUE'
    ],
    ToAddresses: [
      'STRING_VALUE'
    ]
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
        Data: 'STRING_VALUE' /* required */
      },
      Text: {
        Data: 'STRING_VALUE' /* required */
      }
    },
    Subject: { /* required */
      Data: 'STRING_VALUE' /* required */
    }
  },
  Source: 'STRING_VALUE', /* required */
  ReplyToAddresses: [
    'STRING_VALUE'
  ]
})