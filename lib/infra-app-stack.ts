import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs';

export class InfraAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [],
      vpcName: 'application-VPC'
    });

    const internetGateway = new ec2.CfnInternetGateway(this, 'IGW', {
      tags: [{
        key: 'Name', value: 'application-IGW'
      }]
    });

    const igwAttach = new ec2.CfnVPCGatewayAttachment(this, 'IGWAttach', {
      vpcId: vpc.vpcId,
      internetGatewayId: internetGateway.ref
    });

    // TODO: 不要なルートテーブルが作成されているので削除されないようにする
    const publicSubnet1a = new ec2.Subnet(this, 'publicSubnet', {
      availabilityZone: 'ap-northeast-1a',
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.10.0/24',
    });
    cdk.Tags.of(publicSubnet1a).add('Name', 'application-publicSubnet1a');
    publicSubnet1a.addDefaultInternetRoute(internetGateway.ref, igwAttach)

    const privateSubnet1a = new ec2.Subnet(this, 'privateSubnet', {
      availabilityZone: 'ap-northeast-1a',
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.20.0/24',
    });
    cdk.Tags.of(privateSubnet1a).add('Name', 'application-privateSubnet1a');
  }
}
