import * as pulumi from '@pulumi/pulumi'
import * as awsx from '@pulumi/awsx'
import * as eks from '@pulumi/eks'
import { InstanceTypes } from "@pulumi/aws/ec2";

export class NewEksCluster extends pulumi.ComponentResource {
    public kubeconfig: pulumi.Output<any>

    constructor(name: string, opts: pulumi.ComponentResourceOptions = {}) {
        super('eksCluster', name, {}, opts)

        const vpc = new awsx.ec2.Vpc('vpc', {
            numberOfAvailabilityZones: 'all',
            tags: {
                'Name': 'EKS-Cluster'
            }
        })

        const stackConfig = new pulumi.Config('ekscluster')
        const config = {
            dashboard: stackConfig.requireBoolean('dashboard'),
            desiredCapacity: stackConfig.requireNumber('desiredcapacity'),
            minCapacity: stackConfig.requireNumber('mincapacity'),
            maxCapacity: stackConfig.requireNumber('maxcapacity')
        }

        const eksCluster = new eks.Cluster('ekscluster', {
            vpcId: vpc.id,
            subnetIds: vpc.privateSubnetIds,
            instanceType: InstanceTypes.T2_Medium,
            desiredCapacity: config.desiredCapacity,
            minSize: config.minCapacity,
            maxSize: config.maxCapacity,
            storageClasses: "gp2",
            deployDashboard: config.dashboard
        })

        this.kubeconfig = eksCluster.kubeconfig
    }

}
