import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";

export class GitHubOIDCStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const gitHubIdProvider = new iam.OpenIdConnectProvider(this, 'GitHubIdProvider', {
        url: "https://token.actions.githubusercontent.com",
        clientIds: ["sts.amazonaws.com"],
      }
    );

    const gitHubUser: string = '';
    const gitHubRepo: string = '';
    const gitHubBranch: string = '';
    const githubusercontentSub: string = `repo:${gitHubUser}/${gitHubRepo}:ref:refs:heads/${gitHubBranch}`;
    
    const federatedPrincipal = new iam.FederatedPrincipal(
      gitHubIdProvider.openIdConnectProviderArn,
      {
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": githubusercontentSub,
        },
      },
      "sts:AssumeRoleWithWebIdentity"
    );

    const oidcDeployRole = new iam.Role(this, "GitHubOidcRole", {
      roleName: "github-oidc-role",
      assumedBy: federatedPrincipal,
    });

    const repo = new ecr.Repository(this, "MyTempRepo", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });
    repo.grantPullPush(oidcDeployRole);
  }
}