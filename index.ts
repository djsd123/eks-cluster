import * as k8s from '@pulumi/kubernetes'
import * as eksCluster from './eks-cluster'

const k8sCluster = new eksCluster.NewEksCluster('k8s-cluster')

const k8sProvider = new k8s.Provider('k8sprovider', {
    kubeconfig: k8sCluster.kubeconfig
})
