import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import { ServiceDeployment } from './servicedeployment'

const config = new pulumi.Config()
const clusterStackRef = new pulumi.StackReference(config.require('clusterStackRef'))

const kubeconfig = clusterStackRef.getOutput('kubeconfig').apply(JSON.stringify)
const provider = new k8s.Provider('k8sProvider', { kubeconfig })

const ns = new k8s.core.v1.Namespace('app-ns', {
    metadata: { name: 'eks-demo-apps'},
}, { provider })

const bootcamp = new ServiceDeployment('eks-demo-app', {
    image: 'jocatalin/kubernetes-bootcamp:v2',
    port: { port:3000, targetPort: 8080 },
    namespace: ns.metadata.name,
}, { provider})

export const url = bootcamp.url
