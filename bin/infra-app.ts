#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraAppStack } from '../lib/infra-app-stack';

const app = new cdk.App();
new InfraAppStack(app, 'InfraAppStack', {

});