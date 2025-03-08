'use client'

import { getNsgdProgram, getNsgdProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useNsgdProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getNsgdProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getNsgdProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['nsgd', 'all', { cluster }],
    queryFn: () => program.account.nsgd.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['nsgd', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ nsgd: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useNsgdProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useNsgdProgram()

  const accountQuery = useQuery({
    queryKey: ['nsgd', 'fetch', { cluster, account }],
    queryFn: () => program.account.nsgd.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['nsgd', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ nsgd: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['nsgd', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ nsgd: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['nsgd', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ nsgd: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['nsgd', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ nsgd: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
