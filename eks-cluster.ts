import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as eks from '@pulumi/eks'
import { InstanceTypes } from "@pulumi/aws/ec2";

export class NewEksCluster extends pulumi.ComponentResource {
    public kubeconfig: pulumi.Output<any>

    constructor(name: string, opts: pulumi.ComponentResourceOptions = {}) {
        super('eksCluster', name, {}, opts)

        const vpc = new awsx.ec2.Vpc('vpc', {
            numberOfAvailabilityZones: 'all'
        })

        const eksCluster = new eks.Cluster('ekscluster', {
            vpcId: vpc.id,
            nodeSubnetIds: vpc.privateSubnetIds,
            instanceType: InstanceTypes.T2_Medium,
            desiredCapacity: vpc.privateSubnetIds.length,
            minSize: 1,
            maxSize: vpc.privateSubnetIds.length,
            storageClasses: "gp2",
            deployDashboard: false
        })

        this.kubeconfig = eksCluster.kubeconfig
    }

}
